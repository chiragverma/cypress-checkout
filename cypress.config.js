const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://checkout.stripe.dev',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    video: true,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    specPattern: 'cypress/tests/**/*.cy.js',
    supportFile: 'cypress/support/index.js',
    env: {
      demoSessionUrl:
        'https://checkout.stripe.dev/api/checkout?country=us&oneTimePriceEnabled=true',
    },
    allowCypressEnv: true,
    setupNodeEvents(on, config) {},
  },
});
