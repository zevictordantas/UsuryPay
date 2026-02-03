import { defineConfig } from '@wagmi/cli';
import { foundry, react } from '@wagmi/cli/plugins';
import { deployments } from './scripts/extract-deployments';

export default defineConfig({
  out: 'src/generated.ts',
  plugins: [
    foundry({
      project: 'src/contracts',
      artifacts: 'out',
      deployments, // Direct import of extracted deployments
      exclude: [
        '**.t.sol/*.json',
        '**.s.sol/*.json',
        'I*/*.json', // interfaces
        'Test.sol/**',
        'Script.sol/**',
        'Common.sol/**',
        'Components.sol/**',
        'StdAssertions.sol/**',
        'StdInvariant.sol/**',
        'StdError.sol/**',
        'StdCheats.sol/**',
        'StdMath.sol/**',
        'StdJson.sol/**',
        'StdStorage.sol/**',
        'StdUtils.sol/**',
        'Vm.sol/**',
        'console.sol/**',
        'safeconsole.sol/**',
      ],
    }),
    react(),
  ],
});
