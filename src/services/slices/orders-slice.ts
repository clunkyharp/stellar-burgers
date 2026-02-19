import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { TOrder } from '@utils-types';

type TOrdersState = {
  feedOrders: TOrder[];
  feedTotal: number;
  feedTotalToday: number;
  profileOrders: TOrder[];
  currentOrder: TOrder | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  feedOrders: [],
  feedTotal: 0,
  feedTotalToday: 0,
  profileOrders: [],
  currentOrder: null,
  orderRequest: false,
  orderModalData: null,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('orders/fetchFeeds', getFeedsApi);

export const fetchProfileOrders = createAsyncThunk(
  'orders/fetchProfileOrders',
  getOrdersApi
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0] || null;
  }
);

export const createOrder = createAsyncThunk(
  'orders/create',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedOrders = action.payload.orders;
        state.feedTotal = action.payload.total;
        state.feedTotalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось получить ленту заказов';
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.profileOrders = action.payload;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrder = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Не удалось оформить заказ';
      });
  }
});

export const { clearCurrentOrder, clearOrderModal } = ordersSlice.actions;

export const ordersReducer = ordersSlice.reducer;
