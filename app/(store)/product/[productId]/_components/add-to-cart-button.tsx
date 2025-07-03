// components/add-to-cart-button.tsx
"use client";

import { useCart, CartItem } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  product: Omit<CartItem, "quantity">;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCart((state) => state.addItem);

  const handleClick = () => {
    addItem({ ...product, quantity: 1 });
  };

  return (
    <Button
      onClick={handleClick}
      className="bg-black text-white hover:opacity-90 transition"
    >
      Adicionar ao Carrinho
    </Button>
  );
}
