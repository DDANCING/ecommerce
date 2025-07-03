
"use client";

import { useCart } from "@/hooks/use-cart";
import Link from "next/link";

export function CartButton() {
  const itemCount = useCart((state) => state.getCartItemCount());

  return (
    
    <Link href="/cart" className="flex gap-1">
        Carrinho
        {itemCount > 0 && (
          <span className=" bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
     
      </Link>
   
  );
}
