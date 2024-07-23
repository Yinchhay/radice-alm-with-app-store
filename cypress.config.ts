import { defineConfig } from "cypress";

export default defineConfig({
  env: {},
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:3000',
    // if testIsolation is false, Cypress will not clear cookies/localStorage before each test
    testIsolation: false,
  },
});
