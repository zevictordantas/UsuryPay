## Event Flow (DAO Payroll – Live Demo)

```
DAO funds SettlementManager
      ↓
CashflowNFT minted to Alice
      ↓
Investor buys NFT (Arc USDC)
      ↓
Yellow session starts
      ↓
Off-chain accrual ticks
      ↓
Yellow submits net accrual
      ↓
SettlementManager settles
```

## Happy Path A — DAO Contributor / Web3 Payroll (Primary Demo)

### Step 1 — Contributor Identity & Payroll Commitment (ENS)

**Flow**

- Contributor logs in as `alice.eth`
- DAO commits:
  - 2,000 USDC over 60 days
- Protocol mints:
  - **Payroll Cashflow NFT**

**ENS Usage**

- ENS text records on `alice.eth`:
  - `income:type=dao-payroll`
  - `income:dao=exampleDAO`
  - `income:currency=USDC`

**Judge signal**

- ENS is not cosmetic
- Identity + income are linked

---

### Step 2 — Upfront Liquidity via Sale (Arc / Circle)

**Flow**

- Alice sells the payroll stream:
  - Sells future 2,000 USDC
  - Receives 1,750 USDC upfront
- Investor pays from another chain
- Arc routes USDC seamlessly

**What to show**

- “Paid from Optimism → settled on Base”
- Single button UX

---

### Step 3 — Yellow Earning Session (Key Technical Moment)

**Concept**  
Payroll is earned continuously → perfect for Yellow sessions.

**Flow**

- DAO opens a **Yellow session** for Alice’s payroll.
- Each “work day”:
  - Off-chain balance updates
  - Investor’s claim increases
- UI shows:
  - “Payroll earned so far: 640 / 2,000 USDC”

**Critical framing**

> The future payroll NFT is being _consumed_ inside a Yellow session.

---

### Step 4 — Settlement

- Session ends
- Yellow settles on-chain
- Arc routes USDC to investor
- Alice’s obligation is fulfilled automatically

---

## Happy Path B — Tokenized Stock Dividend Investor (Secondary Demo)

This is a **shorter, conceptual but still working** demo.

---

### Step 1 — Dividend Source Lock

**Flow**

- Investor holds:
  - Tokenized stock (ERC-20 or ERC-721 mock)
- Locks stock into protocol
- Protocol issues:
  - **Dividend Cashflow NFT**

**Key distinction**

- Asset locked ≠ sold
- Only _dividend rights_ are sold

---

### Step 2 — Sell Dividend Stream Upfront

**Flow**

- Expected dividends:
  - 500 USDC over 12 months
- Investor sells dividend rights for:
  - 420 USDC upfront
- Buyer receives future dividends

**ENS usage**

- ENS name:
  - `dividends.alice.eth`
- Text records:
  - `income:type=equity-dividend`
  - `income:ticker=MOCK`
  - `income:frequency=quarterly`

---

### Step 3 — Yellow Dividend Sessions

**This is the clever merge**

- Each dividend period = **new Yellow session**
- When dividends are announced:
  - Off-chain accrual begins
  - Instant balance updates
- At end of quarter:
  - Session settles on-chain
  - Buyer receives USDC

**Why this is strong**

- Dividends are _episodic_
- Yellow handles uncertainty elegantly

### Optional: Agentic Layer ight)

add a **simple rule-based agent**:

**Agent logic**

- If remaining duration > 15 days:
  - Keep earning
- Else:
  - Auto-sell remaining cashflow at discount

**Why include**

- qualifies for:
  - “Agentic Commerce powered by RWAs”
- Even if simple, it shows programmability

## Overral system idea

### Smart Contracts

- `CashflowNFT` (ERC-1155)
- `SettlementManager`
- ENS resolver reads

### Off-chain

- Yellow session logic
- Accrual simulator

### Infra

- Arc + USDC
- Circle Wallets

### Frontend

- Create cashflow
- Sell cashflow
- Start / tick / end session
- ENS resolution
