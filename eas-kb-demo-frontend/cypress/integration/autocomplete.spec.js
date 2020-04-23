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
