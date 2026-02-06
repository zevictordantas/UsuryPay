import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

if (!process.env.PRIVATE_KEY) throw new Error('PRIVATE_KEY not set');

const NETWORK = {
  chainId: '31337',
  rpcUrl: process.env.RPC_URL || 'http://localhost:8545',
  privateKey: process.env.PRIVATE_KEY,
} as const;

const DEPLOY_SCRIPT = 'Deploy.s.sol';
const CONTRACTS = [
  'Marketplace',
  'MockUSDC',
  'MockECToken',
  'PayrollVaultFactory',
  'PayrollDApp',
  'RBNPrimitive',
  'SettlementManager',
] as const;

// Deploy
execSync(
  `forge script script/${DEPLOY_SCRIPT}:Deploy --rpc-url ${NETWORK.rpcUrl} --private-key ${NETWORK.privateKey} --broadcast`,
  { cwd: 'contracts', stdio: 'inherit' }
);

async function getLatestBroadcastedTransactions(
  deploy_script: string,
  chainId: string
) {
  const runLatestJson = await import(
    `../contracts/broadcast/${deploy_script}/${chainId}/run-latest.json`,
    { assert: { type: 'json' } }
  );

  return runLatestJson.default.transactions;
}

async function main() {
  const transactions = await getLatestBroadcastedTransactions(
    DEPLOY_SCRIPT,
    NETWORK.chainId
  );

  const deployments = Object.fromEntries(
    CONTRACTS.map((name) => {
      const tx = transactions.find(
        (t: { transactionType: string; contractName: string }) =>
          t.transactionType === 'CREATE' && t.contractName === name
      );
      if (!tx) throw new Error(`${name} not found in broadcast`);
      return [name, tx.contractAddress];
    })
  );

  writeFileSync(
    'deployments.json',
    JSON.stringify(deployments, null, 2) + '\n'
  );
  console.log('deployments.json:', deployments);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
