describe('Homepage', () => {

  before(() => {
    cy.visit('/')
  })

  describe('Page Layout', () => {
    describe('Content', () => {
      describe('Help text', () => {
        it('has title', () => {
          cy.contains('.app__content h1', 'Need help?')
        })

        it('has title', () => {
          cy.contains('.search-container-home__title  h1', 'Need help?')
        })

        it('has description', () => {
          cy.contains('.search-container-home__title  p', 'Skip the support line and search for your issue in our knowledgebase.')
        })
      })

      describe('Search form', () => {
        it('has search input', () => {
          cy.get('[data-testid=search-bar]').should(($inputBar) => {
            expect($inputBar.attr('placeholder')).to.be.eq('Search...')
          });
        })

        it('has submit button', () => {
          cy.get('.sui-search-box > input[type=submit]')
        })
      })
    })

    describe('Header', () => {
      const getHeader = () => {
        return cy.get('.layout__header')
      }

      it('should be visible', () => {
        getHeader().should('be.visible')
      })

      it('should contains logo', () => {
        getHeader().get('#header-logo')
      })
    })

    describe('Footer', () => {
      it('contains demo notice', () => {
        cy.contains('.layout__footer', 'Demo created for Elastic internal use only.')
      })
    })
  })

  const viewPorts = ['iphone-6', 'iphone-x', 'ipad-2', 'macbook-15']

  describe('Viewports', () => {
    viewPorts.forEach((viewport) => {
      describe('Test viewport ' + viewport, () => {
        beforeEach(() => {
          cy.viewport(viewport)
        })

        it('should fit in viewport', () => {
          cy.get('#root').then((rootNode) => {
            cy.window().then((window) => {
              expect(rootNode.width()).to.be.at.most(window.innerWidth)
              expect(rootNode.height()).to.be.at.most(window.innerHeight)
            })
          })
        })
      })
    })
  })
})
