import { defineConfig } from '@wagmi/cli';
import { foundry, react } from '@wagmi/cli/plugins';
import deployments from './deployments.json';

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
      ],
      deployments: {
        Marketplace: {
          31337: deployments.Marketplace as `0x${string}`,
        },
        MockUSDC: {
          31337: deployments.MockUSDC as `0x${string}`, // For any network other than 31337 USDC is not mocked, it should be real token
        },
        MockECToken: {
          31337: deployments.MockECToken as `0x${string}`,
        },
        PayrollVaultFactory: {
          31337: deployments.PayrollVaultFactory as `0x${string}`,
        },
        PayrollDApp: {
          31337: deployments.PayrollDApp as `0x${string}`,
        },
        RBNPrimitive: {
          31337: deployments.RBNPrimitive as `0x${string}`,
        },
        SettlementManager: {
          31337: deployments.SettlementManager as `0x${string}`,
        },
      },
    }),
    react(),
  ],
});
