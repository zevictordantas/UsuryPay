import { defineConfig } from '@wagmi/cli';
import { foundry, react } from '@wagmi/cli/plugins';
import deployments from './deployments.json';
import deploymentsSepolia from './deployments-sepolia.json';

export default defineConfig({
  out: 'src/generated.ts',
  plugins: [
    foundry({
      project: './contracts',
      include: [
        'RBNPrimitive.sol/**',
        'SettlementManager.sol/**',
        'Marketplace.sol/**',
        'MockUSDC.sol/**',
        'MockECToken.sol/**',
        'PayrollVault.sol/**',
        'PayrollVaultFactory.sol/**',
        'PayrollDApp.sol/**',
        'PayrollVaultCCTP.sol/**',
      ],
      deployments: {
        Marketplace: {
          31337: deployments.Marketplace as `0x${string}`,
          11155111: deploymentsSepolia.Marketplace as `0x${string}`,
        },
        MockUSDC: {
          31337: deployments.MockUSDC as `0x${string}`, // Only mocked on Anvil
        },
        MockECToken: {
          31337: deployments.MockECToken as `0x${string}`,
          11155111: deploymentsSepolia.MockECToken as `0x${string}`,
        },
        PayrollVaultFactory: {
          31337: deployments.PayrollVaultFactory as `0x${string}`,
          11155111: deploymentsSepolia.PayrollVaultFactory as `0x${string}`,
        },
        PayrollDApp: {
          31337: deployments.PayrollDApp as `0x${string}`,
          11155111: deploymentsSepolia.PayrollDApp as `0x${string}`,
        },
        RBNPrimitive: {
          31337: deployments.RBNPrimitive as `0x${string}`,
        },
        SettlementManager: {
          31337: deployments.SettlementManager as `0x${string}`,
        },
        PayrollVaultCCTP: {
          11155111: deploymentsSepolia.PayrollVaultCCTP as `0x${string}`,
        },
      },
    }),
    react(),
  ],
});
