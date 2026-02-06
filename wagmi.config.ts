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
      ],
      deployments: {
        Marketplace: {
          31337: deployments.Marketplace as `0x${string}`,
        },
        MockUSDC: {
          31337: deployments.MockUSDC as `0x${string}`,
        },
        MockECToken: {
          31337: deployments.MockECToken as `0x${string}`,
        },
        // TODO: RBNPrimitive not added, we need to use ECToken (and this token is actually minted by ECVault, not by Deploy.s.sol)
        // TODO: same as above for SettlementManager
      },
    }),
    react(),
  ],
});
