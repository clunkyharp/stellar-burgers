import { configureStore } from '@reduxjs/toolkit';
import {
  constructorReducer,
  ingredientsReducer,
  ordersReducer,
  userReducer
} from './index';
import { rootReducer } from '../store';

describe('Store', () => {
  it('должен возвращать корректное начальное состояние rootReducer на неизвестный экшен', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      burgerConstructor: constructorReducer(undefined, {
        type: 'UNKNOWN_ACTION'
      }),
      user: userReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      orders: ordersReducer(undefined, { type: 'UNKNOWN_ACTION' })
    });
  });

  it('должен правильно инициализировать rootReducer', () => {
    const store = configureStore({
      reducer: {
        ingredients: ingredientsReducer,
        burgerConstructor: constructorReducer,
        user: userReducer,
        orders: ordersReducer
      }
    });

    // Проверяем начальное состояние
    const state = store.getState();

    // Проверяем наличие всех редьюсеров
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('orders');
  });

  it('должен иметь правильную структуру начального состояния ingredients', () => {
    const store = configureStore({
      reducer: {
        ingredients: ingredientsReducer,
        burgerConstructor: constructorReducer,
        user: userReducer,
        orders: ordersReducer
      }
    });

    const state = store.getState();

    expect(state.ingredients).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
  });

  it('должен иметь правильную структуру начального состояния burgerConstructor', () => {
    const store = configureStore({
      reducer: {
        ingredients: ingredientsReducer,
        burgerConstructor: constructorReducer,
        user: userReducer,
        orders: ordersReducer
      }
    });

    const state = store.getState();

    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('должен иметь правильную структуру начального состояния user', () => {
    const store = configureStore({
      reducer: {
        ingredients: ingredientsReducer,
        burgerConstructor: constructorReducer,
        user: userReducer,
        orders: ordersReducer
      }
    });

    const state = store.getState();

    expect(state.user).toEqual({
      user: null,
      isAuthenticated: false,
      isAuthChecked: false,
      isLoading: false,
      error: null,
      updateError: null
    });
  });

  it('должен иметь правильную структуру начального состояния orders', () => {
    const store = configureStore({
      reducer: {
        ingredients: ingredientsReducer,
        burgerConstructor: constructorReducer,
        user: userReducer,
        orders: ordersReducer
      }
    });

    const state = store.getState();

    expect(state.orders).toEqual({
      feedOrders: [],
      feedTotal: 0,
      feedTotalToday: 0,
      profileOrders: [],
      currentOrder: null,
      orderRequest: false,
      orderModalData: null,
      isLoading: false,
      error: null
    });
  });
});
