# Payroll dApp **with credit line** and a new Revenue-Backed Note (RBN) primitive

*(RBN = tokenized future cashflow / revenue-backed debt instrument)*

---

## Problem

Over-collateralization dominates DeFi. 
Predictable future cash inflows (payroll, subscriptions, protocol fees) remain underfinanced because there’s no simple, on-chain, loan-level instrument that: 
  1. Encodes the receivable 
  2. Exposes underwriting provenance 
  3. Lets capital price that credit directly.

A more in detail explanation of the problem can be found on [loom-levenue whitepaper](https://lambdaclass.com/loom-levenue.pdf)

---

## Core thesis

Exactly how traditional banks operate today, employees payment is a predictable cashflow and future income can be priced and traded in the present.

Banks can offer his clients an under-collateralized creidt line based on that future income, assesing the risk of default of the client to crrectly price the repayment.

While banks can enforce law uppon payment defaults, its not common to require law enforcment. Benefits of a creditworthy account overcome benefits of defaulting.

We can offer a similar service through a Crypto payroll app (with strong incentives to operate as a DAO)

We can implement a **DeFi primitive** that enables **tokenized trading of undercollateralized future cashflows**. We call this primitive Revenue-Backed Note (RBN).

---

## Specific Solution

* Define an on-chain **RBN** that binds: originator, terms, repayment schedule, attestation CID, risk-model version, and status.
* DAO originators underwrite and front advances. Offerning the employees instant creditlines and minting RBNs that can be tradable on-chain.
* Investors buy RBNs using market demmand to adjust yield (the interest of the credit-lines). 
* DAO governance refines underwriting (risk assesment, interest rates, etc)
* Investors are incentivized to participate in the DAO since they seek for higher yield and low default rates
* Payroll dApp = concrete vertical to demo the primitive with on-chain, interceptable cashflows.

---

## Basic economics:

For a single RBN:

* (P) = principal advanced now
* (R) = contractual total repayment (principal + interest + fees)
* (q) = probability of repayment (empirical)
* (D) = recovery on default

Expected RBN value:
```math
\mathbb{E}[\text{RBN}] = q \cdot R + (1 - q) \cdot D
```

Investor price (X) (time-discounted):
```math
X \approx \frac{\hat{q} \cdot R}{(1 + r + \lambda)^T}
```

Feasible trade band for a bank selling to investors:

```math
P < X < \mathbb{E}[\text{RBN}]
```

Surplus split:

* Bank profit = (X - P)
* Investor expected profit = $(\mathbb{E}[\text{RBN}] - X)$

Design levers: advance rate, caps, originator first-loss, R (policy). **q** is learned from outcomes; **R** is the control variable.

---

## Current landscape (closest comparisons)

* **Maple / Goldfinch / Clearpool** — originator credit markets (institutional, opaque).
* **Pendle** — yield tokenization (no default risk).
* **Aave credit delegation** — delegated borrowing, not tokenized receivables.
* **3jane** — money-market yield pooling (not loan-level).
* **Levenue / Loom (whitepaper)** — similar receivable financing ideas (closest).
  **Gap:** none focus on a simple, open, loan-level RBN primitive with DAO governance and payroll demo. Their described implementation is different and is focused on off-chain attestation.

---

## What makes us different (value proposition)

1. **Primitive focus:** single, composable instrument for trading undercollateralized future cashflows (RBN).
2. **Open underwriting:** originator publishes risk function/version; investors see provenance and performance.
3. **DAO alignment:** investors govern underwriting and benefit from improving models — incentives converge.
4. **Loan-level pricing:** aftermarket lets capital reveal fair yield per receivable rather than pooled black boxes.
5. **Payroll demo:** concrete vertical with on-chain streams — borrower UX: instant advance; investor UX: selectable loan buys.
6. **Small loans:** Individual creditlines and specific RBNs makes defaults locallized and do not represent a big risk (individually).

---

## MVP

* **Vertical:** crypto payroll. on-chain payments solution that gives employees an under-colateralized credit line.
* **Contracts:** To be defined.
* **Attestations:** To be defined
* **Policies and Risk Assesment:** To be defined
* **Flow demo:** schedule pay → advance issued → RBN minted → seeded buyer purchases → scheduled repayment → settlement; show on-chain provenance and price reaction. (To be defined)

---

## Out of scope for MVP

* Legal enforcement / court transfers of “rights to sue”
* Permissionless off-chain gig payroll without accountable attestations
* Auto-adjusting yields driven by on-chain price feedback (too exploitable)
* Full KYC/regulatory lending stack (future)
* Complex ZK proofs for private inputs (future)

---

## Scalability & expansion

* Add verticals: subscriptions, invoices, vesting unlocks, protocol fee streams (each vertical requires specific advance factors and recovery assumptions).
* Risk ramping: small initial limits that grow with repayment history.
* Tranching and institutional products after on-chain performance history accrues.
* Identity/anti-Sybil: integrate ENS profiles / zkPassport to raise caps for verified persons.
* Composability: RBNs can be collateral for on-chain products once track record exists.

---

## Tracks to follow

* **Arc / L2 track:** deploy ARC, cheap demos and quick settlement. Use Cross-Chain Transfer Protocol (CCTP) to allow having treassury deployed on one-chain and paying loans multichain.
* **ENS / identity track:** link attestations to ENS or zkPassport to demonstrate anti-Sybil strategy. We could also include risk score on ENS

---

## Potential pushbacks & tight counters

1. **“Not novel / been done”**
   * Novelty is on our specific **implementation of the RBN primitive.** Also our DAO-governed open underwriting + payroll is new. We show loan-level provenance and live aftermarket repricing. Not opaque credit.

2. **“Regulatory/consumer risk”**
   * Loan sizing reduces consumer risk. Loan size grows as loans are taken, ensuring the previous revenue covers risks. Compensatory interest can be applyed and other economic punishment can be applyed. **This is an MVP and there is explicit legal roadmap.**

3. **“Data/oracle spoofing / sybil”**
   * Payroll is fully on-chain, we don't require off-chain attestations of payment data. ENS/zkPassport for registration required to avoid sybil attacks and avoid massive defaults. Time ramps can help sybil also. "Sophisticated" Risk assesment caps.

4. **“Liquidity bootstrapping”**
   * Seed buyers and DAO backstop for demo; show economic simulations; emphasize plumbing rather than permanent market depth claims.

5. **“Market manipulation (wash trades)”**
   * No auto-yield controls, DAO rate changes only. Settlement cooldowns, caps, and anti-wash limits. In summary: price = signal, not (automatic) control.
