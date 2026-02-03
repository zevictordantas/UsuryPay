# Hackathon Tracks – Targeting & Integration Roadmap

## 1. Sponsor & Track Priorities

### 🟢 Arc / Circle — **PRIMARY TRACK**

**Why**

- USDC-native credit and treasury system
- Strong alignment with onchain lending, payouts, and capital routing
- EVM-compatible, fast to ship, judge-friendly

**What we target**

- _Best Chain-Abstracted USDC Apps Using Arc as a Liquidity Hub_
- _Build Global Payouts and Treasury Systems with USDC on Arc_ (secondary)

---

### 🟡 ENS — **SECONDARY TRACK (MVP-INCLUDED)**

**Why**

- Fully on-chain, no off-chain dependencies
- Low integration cost, high narrative value
- Natural fit for credit identity and risk signaling

---

### ⚪ Yellow Network — **OUT OF MVP (FUTURE WORK)**

**Why not now**

- Requires off-chain session logic and attestations
- Adds execution risk for limited hackathon time
- Not required to validate cashflow-backed credit

**Positioning**

- Explicitly presented as a _future integration_ for off-chain micropayment ingestion

---

## 2. How the Project Fits Each Track

### Arc / Circle Fit

Our project is a **USDC-denominated, cashflow-backed credit protocol** where:

- Liquidity is pooled on **Arc**
- Loans are issued from a single treasury
- Cashflows can originate from _any EVM chain_
- User experience is chain-agnostic

This directly matches:

- Cross-chain credit systems
- Chain-abstracted liquidity
- Treasury-centric applications

---

### ENS Fit

ENS is used as **credit identity**, not just name resolution.

Concrete usage:

- Borrowers are identified by `ensName`
- Risk metadata stored via ENS text records:
  - `credit.score`
  - `credit.tier`
  - `credit.updatedAt`

Benefits:

- Human-readable borrower profiles
- Portable, composable credit signaling
- Clear justification for ENS in DeFi

---

### Yellow (Future Fit)

Yellow enables:

- Gasless, instant micropayments
- Off-chain cashflow streams

In the future:

- Yellow sessions could become **high-frequency cashflow sources**
- Settled balances feed directly into the risk engine

Not required for MVP validation.

---

## 3. Required Tools & How We Use Them

### Arc / Circle

- **Arc**: deployment network for treasury and loan contracts
- **USDC**: sole accounting and settlement asset
- **Circle Wallets**: managed wallets for demo treasury + users
- **Circle Gateway**: USDC movement across chains (optional in MVP)

---

### ENS

- ENS name resolution (wagmi / viem)
- ENS text record reads/writes for risk metadata

---

## 4. Integration Roadmap (Execution Order)

### Phase 1 — Core Credit (Must-have)

- Deploy treasury + loan contracts on Arc
- USDC deposit / borrow flows
- Fixed-rule loan issuance

### Phase 2 — Cashflow & Risk

- Index on-chain inflows (ERC20 transfers, streams)
- Compute cashflow score
- Enforce loan limits by tier

### Phase 3 — ENS Integration

- Resolve borrower ENS names
- Write/read risk metadata to ENS
- Display ENS-based credit profiles in UI

### Phase 4 — Cross-Chain (Optional)

- Demonstrate USDC inflow from another EVM chain
- Route liquidity back to Arc treasury

### Phase 5 — Yellow (Post-hackathon)

- Off-chain session cashflows
- High-frequency micropayment ingestion

---

## 5. Final Positioning

**MVP**: On-chain, USDC credit backed by predictable cashflows

**Arc**: Liquidity + settlement layer

**ENS**: Credit identity + risk signaling

**Yellow**: Future scaling layer for off-chain micropayments
