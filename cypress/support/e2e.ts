/// <reference types="cypress" />

// Глобальные команды и настройки для Cypress

Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

// Команда для ожидания загрузки React-приложения
Cypress.Commands.add('waitForApp', () => {
  cy.get('body').should('not.be.empty');
  cy.document().should('not.have.property', 'loading');
});
