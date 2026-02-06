import { defineConfig } from '@wagmi/cli'
import { foundry, react } from '@wagmi/cli/plugins'
import deployments from './deployments.json'

export default defineConfig({
  out: 'src/generated.ts',
  plugins: [
    foundry({
      project: './contracts',
      include: ['Marketplace.sol/**'],
      deployments: {
        Marketplace: {
          31337: deployments.Marketplace as `0x${string}`,
        },
      },
    }),
    react(),
  ],
})
