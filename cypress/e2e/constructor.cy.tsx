/// <reference types="cypress" />

import ingredients from '../fixtures/ingredients.json';
import user from '../fixtures/user.json';
import order from '../fixtures/order.json';

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const ORDER_NUMBER = String(order.order.number);
const SELECTORS = {
  modal: '[data-cy=modal]',
  modalClose: '[data-cy=modal-close]',
  modalOverlay: '[data-cy=modal-overlay]'
};
const TEXT = {
  addButton: 'Добавить',
  orderButton: 'Оформить заказ',
  ingredientDetailsTitle: 'Детали ингредиента',
  calories: 'Калории, ккал',
  chooseBuns: 'Выберите булки',
  chooseFilling: 'Выберите начинку'
};

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
      cy.contains('button', TEXT.addButton).click();
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

    cy.contains(TEXT.ingredientDetailsTitle).should('be.visible');
    cy.contains(BUN_NAME).should('be.visible');
    cy.contains(TEXT.calories).should('be.visible');

    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.modalClose).click();
    cy.contains(TEXT.ingredientDetailsTitle).should('not.exist');

    cy.contains('a', BUN_NAME).click();
    cy.contains(TEXT.ingredientDetailsTitle).should('be.visible');

    cy.get(SELECTORS.modalOverlay).click({ force: true });
    cy.contains(TEXT.ingredientDetailsTitle).should('not.exist');
  });

  it('создаёт заказ, показывает номер, закрывает модалку и очищает конструктор', () => {
    addIngredientByName(BUN_NAME);
    addIngredientByName(MAIN_NAME);

    cy.contains('button', TEXT.orderButton).click();
    cy.wait('@createOrder')
      .its('request.body')
      .should('deep.equal', {
        ingredients: [
          '643d69a5c3f7b9001cfa093c',
          '643d69a5c3f7b9001cfa0941',
          '643d69a5c3f7b9001cfa093c'
        ]
      });

    cy.get(SELECTORS.modal).should('be.visible');
    cy.contains(ORDER_NUMBER).should('be.visible');

    cy.get(SELECTORS.modalClose).click();
    cy.contains(ORDER_NUMBER).should('not.exist');

    cy.contains(TEXT.chooseBuns).should('exist');
    cy.contains(TEXT.chooseFilling).should('exist');
  });
});
