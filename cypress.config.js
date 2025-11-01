const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // Ajusta baseUrl al puerto donde corre tu Vite dev server (por defecto 5173)
    baseUrl: 'http://localhost:5173',
    // patrón de specs
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: false, // puedes poner 'cypress/support/index.js' si usas soporte
    video: false,
    // timeouts opcionales:
    // defaultCommandTimeout: 8000,
    // pageLoadTimeout: 60000,
  },
})