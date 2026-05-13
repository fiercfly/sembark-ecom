import React, { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react';
import type { CartItem, Product, CartState } from '../types';
import Toast from '../components/Toast';

interface CartContextType extends CartState {
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] };

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return state;
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.payload);
    case 'UPDATE_QUANTITY':
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
    case 'CLEAR_CART':
      return [];
    case 'SET_CART':
      return action.payload;
    default:
      return state;
  }
};

const calculateTotals = (items: CartItem[]) => {
  return items.reduce(
    (acc, item) => ({
      totalAmount: acc.totalAmount + item.price * item.quantity,
      totalQuantity: acc.totalQuantity + item.quantity,
    }),
    { totalAmount: 0, totalQuantity: 0 }
  );
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, [], (initial) => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : initial;
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const { totalAmount, totalQuantity } = calculateTotals(items);

  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => setIsToastVisible(false), 3000);
  };

  const addItem = (product: Product) => {
    const isAlreadyInCart = items.some(item => item.id === product.id);
    if (isAlreadyInCart) {
      showToast(`${product.title} is already in your cart`);
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: product });
    showToast(`Added ${product.title} to cart`);
  };

  const removeItem = (productId: number) => dispatch({ type: 'REMOVE_ITEM', payload: productId });
  const updateQuantity = (id: number, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider
      value={{
        items,
        totalAmount,
        totalQuantity,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
      <Toast 
        message={toastMessage} 
        isVisible={isToastVisible} 
        onClose={() => setIsToastVisible(false)} 
      />
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
