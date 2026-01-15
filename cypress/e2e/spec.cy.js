// cypress/e2e/ventas-no-auth.cy.js
// Versión sin inyectar autenticación: interceptamos las llamadas y visitamos /products/ventas.
// Úsalo solo si tu entorno NO exige auth para navegar a esa ruta.

describe('Ventas - sin autenticación (stubs sólo)', () => {
  const ventasPattern = '**/api/venta**'
  const ventasCountPattern = '**/api/venta/count**'

  beforeEach(() => {
    cy.intercept('GET', ventasPattern, {
      statusCode: 200,
      body: {
        data: [
          {
            id: 1,
            fecha: "2025-08-31T02:19:14.000Z",
            total: 55000,
            distribuidor: { id: 2, name: "Distribuidor Zona 2", apellido: "Dis", valorEntrega: 500, zona: 2 },
            cliente: { id: 1, name: "Tomas", apellido: "Ramos", dni: 45504689, usuario: "tomasRamos@gmail.com", zona: { id:1, name:"Oeste" } },
            itemsVenta: [{ id: 1, cantidad: 1, precio: 5000, subtotal: 5000, producto: { id: 3, name: "jamon crudo" }, venta: 1 }]
          }
        ]
      }
    }).as('getVentas')

    cy.intercept('GET', ventasCountPattern, { statusCode: 200, body: { data: 1 } }).as('getVentasCount')
  })

  it('muestra el count y el listado de ventas', () => {
    cy.visit('/products/ventas')

    // Esperamos a que lleguen las respuestas stub
    cy.wait('@getVentas')
    cy.wait('@getVentasCount')

    // Verificamos que el componente listó las ventas
    cy.get('.ventas-table', { timeout: 10000 }).should('exist')
    cy.get('.venta-row').should('have.length.at.least', 1)

    // Comprobamos cliente y total en la primera fila
    cy.get('.venta-cliente').first().should('contain.text', 'Tomas')
    cy.get('.venta-total').first().invoke('text').then(txt => {
      const raw = txt.replace(/\s/g, '')
      expect(/55000|55\.000|\$55/.test(raw)).to.be.true
    })

    // Verificamos el count mostrado donde corresponda en tu UI.
    // Si el count se muestra en el dashboard, ajusta el selector; aquí se comprueba un elemento que contenga "1" en el contexto.
    cy.contains(/\b1\b/).should('exist')
  })
})