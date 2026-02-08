# UsuryPay Protocol
Our product is a protocol that enables _tokenization of rights to future cash-flows_ using our protocol new primitive, **Expected Cashflow Token (EC Token)**. This tokenization allows you to trade and buy future cash flows in exchange for current liquidity.

In deepth description here: [Description.md](./docs/Description.md)

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

install everything using: 

```bash
pnpm install
```

also run

```bash
cd contracts && forge install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

| Environment | Chain | Purpose |
|-------------|-------|---------|
| Development | Anvil (local) | Local testing |
| MVP | Sepolia | Testnet validation |
Lets think about it huh

**Architecture:** ECVault (trustless on-chain) + Arc (cross-chain USDC routing) + Yellow (off-chain micropayments WIP at the moment) .

See [docs/Integrations.md](./docs/Integrations.md) for full integration strategy.
