/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-testid attribute.
     * @example cy.getBySel('greeting')
     */
    getBySel(dataTestId: string): Chainable<JQuery<HTMLElement>>;
  }
} 