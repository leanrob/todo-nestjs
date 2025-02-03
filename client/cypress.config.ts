import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents() {
      // implement node event listeners here
    },
    experimentalRunAllSpecs: true,
    chromeWebSecurity: false,
    video: false,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 0,
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
}); 