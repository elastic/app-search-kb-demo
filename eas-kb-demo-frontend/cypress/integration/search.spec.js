describe('Search result page', () => {

  const searchQuery = 'elasticsearch api';

  describe('Launch search from the homepage', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    const typeSearch = (searchQuery) => {
      return cy.get('[data-testid=search-bar]').type(searchQuery);
    }
    
    it ('when pressing ENTER', () => {
      typeSearch(searchQuery + '{enter}')
      cy.get('.search-container-results')
    })

    it ('when pressing clicking the submit button', () => {
      typeSearch(searchQuery)
      cy.get('.sui-search-box > input[type=submit]').click()
      cy.get('.search-container-results')
    })
  })


  describe('Search result page for "' + searchQuery + '"', () => {
    before(() => {
      cy.visit('/?q=' + searchQuery)
    })

    describe('Search form', () => {
      it('has search input with value "' + searchQuery + '"', () => {
        cy.get('[data-testid=search-bar]').should('have.value', searchQuery);
      })

      it('has submit button', () => {
        cy.get('.sui-search-box > input[type=submit]')
      })
    })

    describe('Paging info', () => {
      it('should contain the search query', () => {
        cy.contains('.sui-paging-info', searchQuery);
      })
    })

    describe('Results', () => {

    })

    describe('Sidebar', () => {
      describe('Mobile viewports', () => {
        ['iphone-6', 'iphone-x', 'ipad-2'].forEach((viewport) => {
          it ('should be hidden on device "' + viewport + '"', () => {
            cy.viewport(viewport)
            cy.get('.search-container__search-result-layout__sidebar').should('not.be.visible')
          })
        })
      })

      describe('Default viewport', () => {
        it('should be visible by default', () => {
          cy.get('.search-container__search-result-layout__sidebar').should('be.visible')
        })

        describe('Page type facet', () => {
          
        })

        describe('Product facet', () => {
          
        })
      })
    })

    describe('Pagination', () => {

    })
  })
})
