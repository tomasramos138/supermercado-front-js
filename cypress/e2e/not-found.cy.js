
/*El test verifica que, al ingresar una URL inexistente, 
la aplicación renderice correctamente el componente NotFound, mostrando el código 404, 
el mensaje correspondiente y el botón para volver al inicio.*/

describe('Routing - NotFound', () => {

  it('debe renderizar el componente NotFound cuando la ruta no existe', () => {

    cy.visit('/esto-no-existe-123')

    // Verificamos que estamos en la URL incorrecta
    cy.url().should('include', 'esto-no-existe-123')

    // Verificamos que se renderiza el contenedor principal
    cy.get('.nf__container').should('exist')

    // Verificamos el código 404
    cy.get('.nf__status')
      .should('exist')
      .and('contain.text', '404')

    // Verificamos el título
    cy.get('.nf__title')
      .should('contain.text', 'Página No Encontrada')

    // Verificamos el mensaje
    cy.get('.nf__message')
      .should('contain.text', 'no existe')

    // Verificamos que el botón/link al home existe
    cy.get('.home-button')
      .should('exist')
      .and('have.attr', 'href', '/')
  })

})