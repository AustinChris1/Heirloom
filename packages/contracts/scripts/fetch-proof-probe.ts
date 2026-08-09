import { prepareRequest, DA_LAYER_BASE } from "./fdc";

/**
 * The DA Layer indexes an attestation under the round it was *confirmed* in,
 * which is not always the round derived from the submitting block's timestamp.
 * Rather than guess, probe a small window around it.
 */
const TX = process.env.XRPL_TX ?? "84C022779EF8DE35134FFB4C263A6A81CF150DE6C4BFFAE0D6DD4D369A7EDB8D";
const CENTRE = Number(process.env.ROUND ?? 1420031);
const OWNER = "0xe15c11b07C0f7954A7CAD170B39B49661A4db59C";

async function main() {
  const encoded = await prepareRequest("XRPPayment", {
    transactionId: `0x${TX}`,
    proofOwner: OWNER,
  });
  console.log(`request: ${encoded.slice(0, 50)}…\n`);

  for (const round of [CENTRE, CENTRE + 1, CENTRE - 1, CENTRE + 2, CENTRE + 3]) {
    const res = await fetch(`${DA_LAYER_BASE}/api/v1/fdc/proof-by-request-round-raw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ votingRoundId: round, requestBytes: encoded }),
    });
    const text = await res.text();
    const ok = res.ok && text.includes("proof");
    console.log(`round ${round}: HTTP ${res.status} ${ok ? "*** FOUND ***" : text.slice(0, 90)}`);
    if (ok) {
      console.log(`\nUse ROUND=${round}`);
      return;
    }
  }
  console.log("\nnot found in that window.");
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exitCode = 1;
});
