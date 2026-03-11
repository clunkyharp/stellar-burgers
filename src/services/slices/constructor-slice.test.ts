import {
  constructorReducer,
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from './constructor-slice';
import { TIngredient } from '@utils-types';

describe('constructorSlice', () => {
  const mockBun: TIngredient = {
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
  };

  const mockMain: TIngredient = {
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
  };

  const mockSauce: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0943',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  };

  describe('addIngredient', () => {
    it('должен добавить булку в конструктор', () => {
      const state = constructorReducer(initialState, addIngredient(mockBun));

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toHaveLength(0);
    });

    it('должен добавить начинку в конструктор', () => {
      const state = constructorReducer(initialState, addIngredient(mockMain));

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe('Биокотлета из марсианской Магнолии');
      expect(state.ingredients[0]).toHaveProperty('id');
    });

    it('должен добавить несколько ингредиентов', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      state = constructorReducer(state, addIngredient(mockMain));

      expect(state.ingredients).toHaveLength(3);
    });

    it('должен заменять булку при добавлении новой', () => {
      const stateWithBun = constructorReducer(initialState, addIngredient(mockBun));
      expect(stateWithBun.bun).toEqual(mockBun);

      // Добавляем другую булку (используем ту же mockBun с другим id для теста)
      const anotherBun = { ...mockBun, _id: 'another-bun-id', name: 'Булка N-100i' };
      const stateWithNewBun = constructorReducer(stateWithBun, addIngredient(anotherBun));

      expect(stateWithNewBun.bun).toEqual(anotherBun);
      expect(stateWithNewBun.bun?._id).toBe('another-bun-id');
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить ингредиент из конструктора', () => {
      // Добавляем ингредиент
      let state = constructorReducer(initialState, addIngredient(mockMain));
      const ingredientId = state.ingredients[0].id;

      // Удаляем ингредиент
      state = constructorReducer(state, removeIngredient(ingredientId));

      expect(state.ingredients).toHaveLength(0);
    });

    it('должен не менять состояние при удалении несуществующего ингредиента', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, removeIngredient('non-existent-id'));

      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('moveIngredientUp', () => {
    it('должен переместить ингредиент вверх', () => {
      // Добавляем два ингредиента
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));

      const firstIngredient = state.ingredients[0].name;
      const secondIngredient = state.ingredients[1].name;

      // Перемещаем второй ингредиент вверх
      state = constructorReducer(state, moveIngredientUp(1));

      expect(state.ingredients[0].name).toBe(secondIngredient);
      expect(state.ingredients[1].name).toBe(firstIngredient);
    });

    it('не должен перемещать первый ингредиент вверх', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      const firstIngredientName = state.ingredients[0].name;

      state = constructorReducer(state, moveIngredientUp(0));

      expect(state.ingredients[0].name).toBe(firstIngredientName);
    });
  });

  describe('moveIngredientDown', () => {
    it('должен переместить ингредиент вниз', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));

      const firstIngredient = state.ingredients[0].name;
      const secondIngredient = state.ingredients[1].name;

      // Перемещаем первый ингредиент вниз
      state = constructorReducer(state, moveIngredientDown(0));

      expect(state.ingredients[0].name).toBe(secondIngredient);
      expect(state.ingredients[1].name).toBe(firstIngredient);
    });

    it('не должен перемещать последний ингредиент вниз', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));
      const lastIngredientName = state.ingredients[1].name;

      state = constructorReducer(state, moveIngredientDown(1));

      expect(state.ingredients[1].name).toBe(lastIngredientName);
    });
  });

  describe('clearConstructor', () => {
    it('должен очистить конструктор', () => {
      // Добавляем ингредиенты и булку
      let state = constructorReducer(initialState, addIngredient(mockBun));
      state = constructorReducer(state, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));

      // Очищаем конструктор
      state = constructorReducer(state, clearConstructor());

      expect(state).toEqual(initialState);
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
