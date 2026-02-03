import fs from 'fs';
import path from 'path';

interface Transaction {
  transactionType: string;
  contractName: string;
  contractAddress: string;
}

interface RunData {
  transactions: Transaction[];
  chain: number;
}

interface FoundryDeployments {
  [contractName: string]: {
    [chainId: number]: `0x${string}`;
  };
}

const CONTRACTS = [
  'MockUSDC',
  'RBNToken',
  'EmployerTreasury',
  'EmployerTreasuryFactory',
  'PayrollManager',
  'PayrollMarketplace',
];

function extractDeployments(): FoundryDeployments {
  const deployments: FoundryDeployments = {};

  // Support multiple chain deployments by looking through broadcast folders
  const broadcastDir = path.join(
    process.cwd(),
    'src/contracts/broadcast/Deploy.s.sol'
  );

  if (!fs.existsSync(broadcastDir)) {
    console.warn('No deployment data found. Run forge script first.');
    return deployments;
  }

  // Get all chain directories (31337, 1, 5, etc.)
  const chainDirs = fs
    .readdirSync(broadcastDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((name) => /^\d+$/.test(name)); // Only numeric chain IDs

  for (const chainDir of chainDirs) {
    const runLatestPath = path.join(broadcastDir, chainDir, 'run-latest.json');

    if (fs.existsSync(runLatestPath)) {
      const runData: RunData = JSON.parse(
        fs.readFileSync(runLatestPath, 'utf8')
      );

      for (const contract of CONTRACTS) {
        const tx = runData.transactions.find(
          (tx) =>
            tx.transactionType === 'CREATE' && tx.contractName === contract
        );

        if (tx?.contractAddress) {
          if (!deployments[contract]) {
            deployments[contract] = {};
          }
          deployments[contract][runData.chain] =
            tx.contractAddress as `0x${string}`;
        }
      }
    }
  }

  return deployments;
}

export const deployments = extractDeployments();
console.log('Extracted deployments:', JSON.stringify(deployments, null, 2));
