/// <reference types="cypress" />

import ingredients from '../fixtures/ingredients.json';
import user from '../fixtures/user.json';
import order from '../fixtures/order.json';

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const ORDER_NUMBER = String(order.order.number);

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      statusCode: 200,
      body: {
        success: true,
        data: ingredients
      }
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: user
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      body: order
    }).as('createOrder');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'mock-refresh-token');
        win.document.cookie = 'accessToken=mock-access-token';
      }
    });

    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.clearLocalStorage('refreshToken');
  });

  const addIngredientByName = (name: string) => {
    cy.contains('li', name).within(() => {
      cy.contains('button', 'Добавить').click();
    });
  };

  it('добавляет булку и начинку из списка в конструктор', () => {
    addIngredientByName(BUN_NAME);
    addIngredientByName(MAIN_NAME);

    cy.contains(`${BUN_NAME} (верх)`).should('exist');
    cy.contains(`${BUN_NAME} (низ)`).should('exist');
    cy.get('main').contains(MAIN_NAME).should('exist');
  });

  it('открывает и закрывает модальное окно ингредиента (крестик и оверлей)', () => {
    cy.contains('a', BUN_NAME).click();

    cy.contains('Детали ингредиента').should('be.visible');
    cy.contains(BUN_NAME).should('be.visible');
    cy.contains('Калории, ккал').should('be.visible');

    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('[data-cy=modal-close]').click();
    cy.contains('Детали ингредиента').should('not.exist');

    cy.contains('a', BUN_NAME).click();
    cy.contains('Детали ингредиента').should('be.visible');

    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('создаёт заказ, показывает номер, закрывает модалку и очищает конструктор', () => {
    addIngredientByName(BUN_NAME);
    addIngredientByName(MAIN_NAME);

    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder')
      .its('request.body')
      .should('deep.equal', {
        ingredients: [
          '643d69a5c3f7b9001cfa093c',
          '643d69a5c3f7b9001cfa0941',
          '643d69a5c3f7b9001cfa093c'
        ]
      });

    cy.get('[data-cy=modal]').should('be.visible');
    cy.contains(ORDER_NUMBER).should('be.visible');

    cy.get('[data-cy=modal-close]').click();
    cy.contains(ORDER_NUMBER).should('not.exist');

    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
