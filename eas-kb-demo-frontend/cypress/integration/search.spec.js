/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
      it('should display 10 results', () => {
        cy.get('.search-container__search-result-layout__list').within(() => {
          cy.get('li > div.search-container__search-result-layout__list__result').should('have.length', 10)
        })
      })
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

        describe('Sidebar', () => {
          it('should be visible by default', () => {
            cy.get('.search-container__search-result-layout__sidebar').should('be.visible')
          })

          describe('Facets', () => {
            beforeEach(() => {
              cy.visit('/?q=' + searchQuery)
            })

            describe('Page type facet', () => {    
              it('should have a page type facet', () => {
                cy.get('.search-container__search-result-layout__sidebar').within(() => {
                  cy.get('.facet').first().within(() => {
                    cy.get('.facet__title').contains('Type')
                    cy.get('.facet__option:first-of-type').should('have.class', 'selected').contains('All')
                    cy.get('.facet__option').not(':first-of-type').each((filterNode) => {
                      cy.wrap(filterNode).find('.facet__option__link').click();
                    })
                  })
                })
              })
            })

            describe('Product facet', () => {
              it('should have a product facet', () => {
                cy.get('.search-container__search-result-layout__sidebar').within(() => {
                  cy.get('.facet').eq(1).within(() => {
                    cy.get('.facet__title').contains('Product')
                    cy.get('.facet__option:first-of-type').should('have.class', 'selected').contains('All')
                    cy.get('.facet__option').not(':first-of-type').each((filterNode) => {
                      cy.wrap(filterNode).find('.facet__option__link').click();
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})
