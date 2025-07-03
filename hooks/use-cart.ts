
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

interface CartState {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],

      addItem: (item) => {
        const existingItem = get().cartItems.find((i) => i.id === item.id);

        if (existingItem) {
          set({
            cartItems: get().cartItems.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ cartItems: [...get().cartItems, { ...item, quantity: 1 }] });
        }
      },

      removeItem: (id) => {
        set({ cartItems: get().cartItems.filter((i) => i.id !== id) });
      },

      updateItemQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          cartItems: get().cartItems.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => {
        set({ cartItems: [] });
      },

      getCartTotal: () => {
        return get().cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getCartItemCount: () => {
        return get().cartItems.reduce(
          (count, item) => count + item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage", // chave do localStorage
    }
  )
);
