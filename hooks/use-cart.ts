import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { StoreProduct } from "@/app/types";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";

interface CartStore {
  items: StoreProduct[];
  addItem: (data: StoreProduct) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
};


const useCart = create(
  
  persist<CartStore>((set, get) => ({
    
    items: [],
    addItem: (data: StoreProduct) => {
      const currentItems = get().items;
      const existingItem = currentItems.find((item) => item.id === data.id);

      if (existingItem) {
        return toast.info("O item já foi adicionado ao carinho.", {
          action: {
            label: "Ver carrinho ",
            onClick: () => redirect("/cart"),
          },
        })
      }

      set({ items: [...get().items, data]});
       return toast.info("O item foi adicionado ao carinho.", {
          action: {
            label: "Ver carrinho ",
            onClick: () => redirect("/cart"),
          },
        })
    },
    removeItem: (id: string) => {
      set({ items: [...get().items.filter((item) => item.id !== id)]});
      toast.success("O item foi removido do carinho.", {
          action: {
            label: "Ver carrinho ",
            onClick: () => redirect("/cart"),
          },
        })
    }, 
    removeAll: () => set({ items: []}),
  }), {
    name: "cart-storage",
    storage: createJSONStorage(() => localStorage)
  })
)

export default useCart;