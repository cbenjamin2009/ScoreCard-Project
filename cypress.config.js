import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.js',
    setupNodeEvents(on) {
      on('before:browser:launch', (browser, launchOptions) => {
        launchOptions.args = launchOptions.args || [];
        if (!launchOptions.args.includes('--no-sandbox')) {
          launchOptions.args.push('--no-sandbox');
        }
        return launchOptions;
      });
    },
  },
});
