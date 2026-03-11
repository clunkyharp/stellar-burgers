import {
  ingredientsReducer,
  initialState,
  fetchIngredients
} from './ingredients-slice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    }
  ];

  describe('fetchIngredients async thunk', () => {
    it('должен установить isLoading в true при pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен записать ингредиенты в store и установить isLoading в false при fulfilled', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.items).toEqual(mockIngredients);
      expect(state.items).toHaveLength(2);
    });

    it('должен записать ошибку в store и установить isLoading в false при rejected', () => {
      const errorMessage = 'Не удалось загрузить ингредиенты';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('должен использовать стандартное сообщение об ошибке при rejected без message', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const state = ingredientsReducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Не удалось загрузить ингредиенты');
    });
  });

  describe('reducer', () => {
    it('должен возвращать начальное состояние', () => {
      const state = ingredientsReducer(undefined, { type: 'unknown' });

      expect(state).toEqual(initialState);
    });
  });
});
