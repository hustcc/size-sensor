import { playwrightLauncher } from '@web/test-runner-playwright';
import { coverageTableReporter } from '@web/test-runner';

export default {
  files: 'tests/**/*.spec.js',
  nodeResolve: true,
  coverage: true,
  coverageConfig: {
    include: ['src/**/*.js'],
    exclude: ['node_modules/**/*', 'tests/**/*'],
    threshold: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' }),
  ],
  reporters: [coverageTableReporter()],
};
