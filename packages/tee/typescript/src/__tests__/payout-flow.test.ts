import { afterAll, beforeAll, describe, expect, it } from "vitest";
import http from "node:http";
import { createHmac } from "node:crypto";
import { encodeAbiParameters, parseAbiParameters, toHex } from "viem";
import { decode } from "ripple-binary-codec";
import { Server } from "../base/server.js";
import { register, reportState, resetState, setSignPort } from "../app/handlers.js";
import { OP_COMMAND_EXECUTE, OP_COMMAND_PAYOUT, VERSION } from "../app/config.js";
import { Will, willCommitment } from "../app/heirloom/will.js";

/**
 * The full enclave payout path, end to end, with a stand-in TEE node.
 *
 * A tiny HTTP server plays the node's sign port: `/decrypt` returns the will
 * plaintext, `/sign` returns a deterministic signature. We drive EXECUTE then
 * PAYOUT through the extension Server exactly as the real proxy would, and
 * assert the payout blobs are real, decodable XRPL Payments signed by the
 * enclave's own derived key — no estate seed anywhere.
 */

const WILL: Will = {
  vaultId: 7,
  estateAccount: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
  bequests: [{ beneficiary: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe", kind: "SHARE_BPS", amount: "10000" }],
  residuaryBeneficiary: "rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf",
};

const EXECUTE_MESSAGE = parseAbiParameters("(uint256, address, bytes32, bytes, uint256, uint256)");

/** The extension's own commitment, so the handler's integrity check passes. */
function willCommitmentHex(): `0x${string}` {
  return willCommitment(WILL) as `0x${string}`;
}

/** Wrap a payload as the DataFixed JSON the Server expects, hex-encoded. */
function action(opCommand: string, originalMessage: string) {
  const dataFixed = {
    instructionId: "0x" + "11".repeat(32),
    opType: bytes32("HEIRLOOM"),
    opCommand: bytes32(opCommand),
    originalMessage,
  };
  return {
    data: {
      id: "0x" + "22".repeat(32),
      type: "instruction",
      submissionTag: "submit",
      message: toHex(Buffer.from(JSON.stringify(dataFixed), "utf-8")),
    },
  };
}

function bytes32(s: string): string {
  const buf = Buffer.alloc(32);
  buf.write(s, "utf-8");
  return "0x" + buf.toString("hex");
}

let node: http.Server;
let server: Server;
let port = 0;

beforeAll(async () => {
  resetState();

  node = http.createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => {
      if (req.url === "/decrypt") {
        // Return the will plaintext, base64, regardless of ciphertext.
        const decryptedMessage = Buffer.from(JSON.stringify(WILL), "utf-8").toString("base64");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ decryptedMessage }));
      } else if (req.url === "/sign") {
        const { message } = JSON.parse(Buffer.concat(chunks).toString("utf-8"));
        const sig = createHmac("sha256", "mock-tee-identity").update(Buffer.from(message, "base64")).digest();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message, signature: sig.toString("base64") }));
      } else {
        res.writeHead(404);
        res.end();
      }
    });
  });
  await new Promise<void>((r) => node.listen(0, r));
  port = (node.address() as { port: number }).port;

  setSignPort(String(port));
  server = new Server("0", String(port), VERSION, register, reportState);
});

afterAll(async () => {
  await new Promise<void>((r) => node.close(() => r()));
});

describe("enclave payout path", () => {
  it("EXECUTE then PAYOUT signs the distribution with the enclave key", async () => {
    // A real price: allocate refuses a zero feed, as it should.
    const executeMsg = encodeAbiParameters(EXECUTE_MESSAGE, [
      [
        7n,
        "0x0000000000000000000000000000000000000000",
        willCommitmentHex(),
        "0xdeadbeef",
        1_030_000_000_000_000_000n,
        100_000_000n,
      ],
    ] as never);

    const [execStatus, execResult] = await server.handleRequestDirect(
      "POST",
      "/action",
      JSON.stringify(action(OP_COMMAND_EXECUTE, executeMsg)),
    );
    expect(execStatus).toBe(200);
    expect((execResult as { status: number }).status).toBe(1);

    // The XRPL key is derived lazily — nothing needed it until now.
    expect((reportState() as { xrplSigner: string | null }).xrplSigner).toBeNull();

    const payoutReq = toHex(
      Buffer.from(JSON.stringify({ vaultId: 7, sequence: 100, lastLedgerSequence: 9_000_000 }), "utf-8"),
    );
    const [payStatus, payResult] = await server.handleRequestDirect(
      "POST",
      "/action",
      JSON.stringify(action(OP_COMMAND_PAYOUT, payoutReq)),
    );
    expect(payStatus).toBe(200);
    const pr = payResult as { status: number; data?: string };
    expect(pr.status).toBe(1);

    const payload = JSON.parse(Buffer.from(pr.data!.replace(/^0x/, ""), "hex").toString("utf-8"));
    // Signing derived the key, and the same address is now reported on /state.
    expect(payload.signer).toMatch(/^r[1-9A-HJ-NP-Za-km-z]{24,34}$/);
    expect((reportState() as { xrplSigner: string | null }).xrplSigner).toBe(payload.signer);
    expect(payload.payments.length).toBeGreaterThan(0);

    // Each blob is a real, decodable XRPL Payment from the estate account.
    for (const p of payload.payments) {
      const tx = decode(p.blob) as Record<string, unknown>;
      expect(tx.TransactionType).toBe("Payment");
      expect(tx.Account).toBe(WILL.estateAccount);
      expect(tx.TxnSignature).toBeTruthy();
    }
  });

  it("refuses a second PAYOUT for the same vault (no double-signing)", async () => {
    const payoutReq = toHex(
      Buffer.from(JSON.stringify({ vaultId: 7, sequence: 200, lastLedgerSequence: 9_000_000 }), "utf-8"),
    );
    const [, payResult] = await server.handleRequestDirect(
      "POST",
      "/action",
      JSON.stringify(action(OP_COMMAND_PAYOUT, payoutReq)),
    );
    expect((payResult as { status: number }).status).toBe(0);
    expect((payResult as { log?: string }).log).toContain("already signed");
  });

  it("refuses PAYOUT for a vault never executed", async () => {
    const payoutReq = toHex(
      Buffer.from(JSON.stringify({ vaultId: 999, sequence: 1, lastLedgerSequence: 9_000_000 }), "utf-8"),
    );
    const [, payResult] = await server.handleRequestDirect(
      "POST",
      "/action",
      JSON.stringify(action(OP_COMMAND_PAYOUT, payoutReq)),
    );
    expect((payResult as { status: number }).status).toBe(0);
    expect((payResult as { log?: string }).log).toContain("no executed distribution");
  });
});
