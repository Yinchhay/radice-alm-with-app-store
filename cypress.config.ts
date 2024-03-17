import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    email: 'admin@gmail.com',
    password: '123456789',
  },
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:3000',
  },
});
