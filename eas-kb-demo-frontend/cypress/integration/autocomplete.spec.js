describe('Autocomplete', () => {

  const searchQuery = 'elasticsearch api';

  beforeEach(() => {
    cy.visit('/')
  })

  describe('Type in the search bar', () => {
    it('should display autocomplete', () => {
      cy.get('[data-testid=search-bar]').type(searchQuery).then(() => {
        cy.get('.search-container__autocomplete').then(() => {
          cy.get('.search-container__autocomplete__result').should('have.length', 5)
        })
      })
    })
  })

  describe('Close autocomplete', () => {
    it('when input lost the focus', () => {
      cy.get('[data-testid=search-bar]').type(searchQuery).then((inputBar) => {
        cy.get('.search-container__autocomplete').then(() => {
          cy.get(inputBar).blur()
          cy.get('.search-container__autocomplete').should('not.exist')
        })
      })
    })
  })
})
