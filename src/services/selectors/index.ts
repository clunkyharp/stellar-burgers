import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;

export const selectIngredientsByType = createSelector(
  [selectIngredients],
  (items) => {
    const ingredients = items || [];
    return {
      buns: ingredients.filter((item) => item.type === 'bun'),
      mains: ingredients.filter((item) => item.type === 'main'),
      sauces: ingredients.filter((item) => item.type === 'sauce')
    };
  }
);

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectAuthLoading = (state: RootState) => state.user.isLoading;
export const selectAuthError = (state: RootState) => state.user.error;
export const selectUpdateUserError = (state: RootState) =>
  state.user.updateError;

export const selectFeedOrders = (state: RootState) => state.orders.feedOrders;
export const selectFeedStats = (state: RootState) => ({
  total: state.orders.feedTotal,
  totalToday: state.orders.feedTotalToday
});
export const selectProfileOrders = (state: RootState) =>
  state.orders.profileOrders;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
export const selectOrderRequest = (state: RootState) =>
  state.orders.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.orders.orderModalData;
