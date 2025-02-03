/// <reference types="cypress" />

// Add custom commands here
Cypress.Commands.add('getBySel', (selector: string) => {
  return cy.get(`[data-testid=${selector}]`);
}); 