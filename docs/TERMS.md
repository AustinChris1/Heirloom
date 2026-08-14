# Terms and Conditions

**Last updated: 14 August 2026**

These terms govern your use of heirloom.wtf and the Heirloom application (the "Service"). By using the Service you agree to them. If you do not agree, do not use it.

Please read section 4, section 10, and section 11 carefully. They limit what the Service promises and what we are liable for.

---

## 1. What Heirloom is

Heirloom is open-source software that lets you register a "vault" on the Flare blockchain, bound to an XRP Ledger account you control. You write a will inside your own browser, encrypt it to a trusted execution environment (the "enclave"), and prove you are alive with periodic small payments on the XRP Ledger. If those payments stop and the network proves the silence, the enclave decrypts your will and signs payments distributing the account according to it.

The Service is a user interface to public smart contracts and public blockchain infrastructure. We publish the interface; the contracts run on a blockchain we do not control.

## 2. What Heirloom is not

**Not a legal will.** Heirloom does not create, replace, or satisfy a testamentary instrument under the inheritance law of any country. Whether an on-chain distribution is recognised by a court, a probate registry, or a tax authority in your jurisdiction is a legal question we cannot answer for you. Heirloom may conflict with a legal will, with forced-heirship rules, or with the duties of an executor.

**Not legal, tax, or financial advice.** Nothing in the Service or its documentation is advice. Consult a qualified professional in your jurisdiction before relying on Heirloom for anything that matters.

**Not a custodian.** We never take possession or control of your funds. Your XRP stays in your own XRP Ledger account throughout. We hold no assets on your behalf, offer no yield, and act as nobody's fiduciary, trustee, executor, or agent.

**Not a financial service.** The Service does not provide banking, trust, estate administration, money transmission, custody, or investment services, and is not licensed or regulated as any of them.

## 3. Testnet only

The Service currently operates on the Flare Coston2 test network and the XRP Ledger testnet. **Test networks carry no real value, may be reset, wiped, or discontinued without notice, and give no guarantee of continuity.**

Do not use the Service to make arrangements for real assets, and do not treat anything created on a test network as a functioning estate plan. If the Service is later deployed to a main network, these terms will be updated before that happens.

## 4. Availability and execution are not guaranteed

The Service depends on infrastructure operated by others: the Flare network and its validators, the Flare Data Connector, Flare Confidential Compute, the XRP Ledger and its validators, wallet extensions, RPC providers, and hosting providers. Any of them may be unavailable, slow, changed, or discontinued.

**We do not guarantee that a distribution will execute, that it will execute on time, or that it will execute at all.** In particular:

- Steps after death are permissionless and require someone, whether you, a beneficiary, or an operator, to submit transactions and pay the associated fees. Nobody is obliged to do this.
- Attestation, dormancy, execution, and payout each depend on third-party infrastructure being live at the moment it is needed.
- An enclave may need to be rebuilt, which can require you to re-authorise it while you are alive.
- The XRP Ledger reserve requirement means an account can never be fully emptied, and an estate too small to cover the reserve and fees will not be distributed.

You remain responsible for making arrangements that do not depend solely on the Service.

## 5. Your responsibilities

You are solely responsible for:

- **Your keys and your wallet.** We never ask for your seed phrase and cannot recover it. Losing it means losing access, permanently.
- **The accuracy of your will.** Beneficiary addresses, amounts, and percentages are yours to get right. Funds sent to a mistyped address cannot be recovered by anyone.
- **Backing up your will file.** It is stored only in your browser. Clearing your browser data or changing device without a backup means you cannot seal or pay out that vault.
- **Sending heartbeats.** If you stop, the Service does what you told it to do. Missing heartbeats through travel, illness, or inattention can open a dormancy claim against a living person. A grace window and the ability to prove life exist for this reason, but using them is on you.
- **Revoking authority when you want to.** You can withdraw the enclave's permission over your XRP Ledger account at any time while alive, from your own wallet.
- **Compliance.** Ensuring your use of the Service is lawful where you live, including inheritance, tax, and financial regulation.

## 6. Eligibility

You must be at least 18 years old and legally capable of entering into these terms. You must not use the Service if you are subject to sanctions, or located in a jurisdiction where doing so would be unlawful.

## 7. Prohibited use

You must not use the Service to launder money, evade sanctions or tax, conceal assets from a lawful claim, defraud any person, or carry out any other unlawful act. You must not attempt to attack, disrupt, or gain unauthorised access to the Service or the infrastructure it relies on.

Because the underlying contracts are permissionless, we may be unable to prevent such use. That does not make it permitted.

## 8. Fees

**The Service charges nothing today.** No fee logic exists in the contracts, the allocation engine, or the enclave.

You always pay the network's own transaction fees, on both Flare and the XRP Ledger, to the network rather than to us. Fees we might charge in future are described as a proposal in the [Business model and roadmap](ROADMAP.md). Any fee would be introduced openly and would not be applied retroactively to a vault created before it existed.

## 9. Source code and intellectual property

The source code is published at [github.com/AustinChris1/Heirloom](https://github.com/AustinChris1/Heirloom) so that every claim in the documentation can be verified. Publication does not by itself grant you a licence to copy, modify, or redistribute it; any such rights are governed by the licence file in that repository, if one is present.

The Heirloom name, logo, and site design remain ours.

## 10. No warranty

**The Service is provided "as is" and "as available", without warranty of any kind**, express or implied, including any implied warranty of merchantability, fitness for a particular purpose, title, or non-infringement.

We do not warrant that the Service will be uninterrupted, timely, secure, or error-free, that defects will be corrected, or that the software, the smart contracts, the enclave, or the third-party infrastructure it depends on are free of vulnerabilities. **The contracts and the enclave have not been independently audited.**

## 11. Limitation of liability

To the fullest extent permitted by law, we are not liable for any loss of funds, loss of access, loss of data, loss of profit, or any indirect, incidental, special, consequential, or exemplary damages arising from your use of, or inability to use, the Service. This includes losses caused by a distribution that executed when it should not have, or failed to execute when it should have.

Where liability cannot lawfully be excluded, it is limited to the greater of the amount you paid us for the Service, which is currently nothing, or one hundred United States dollars.

Nothing here excludes liability for fraud, or for anything else that cannot lawfully be excluded.

## 12. Indemnity

You agree to indemnify us against claims, losses, and costs arising from your use of the Service, your breach of these terms, or your infringement of anyone's rights.

## 13. Third-party services

Wallets, RPC providers, block explorers, and the Flare and XRP Ledger networks are operated by independent parties under their own terms. We do not control them and are not responsible for their acts or omissions.

## 14. Changes and discontinuation

We may change these terms or the Service at any time. Changes are published in the same public repository as the code, with a new date at the top. Continuing to use the Service after a change means you accept it.

We may stop publishing the interface at any time. If we do, the smart contracts remain on-chain and every step after death remains permissionless, so anyone can continue to interact with them independently of us.

## 15. Severability and entire agreement

If any provision is held unenforceable, the rest remains in force. These terms, together with the [Privacy Policy](PRIVACY.md), are the entire agreement between us regarding the Service.

## 16. Governing law

These terms are governed by the laws of the Federal Republic of Nigeria, and the courts of Nigeria have exclusive jurisdiction, without affecting any mandatory consumer protection you have where you live.

## 17. Contact

[@heirloom_xrp](https://x.com/heirloom_xrp) on X, or open an issue on [GitHub](https://github.com/AustinChris1/Heirloom).
