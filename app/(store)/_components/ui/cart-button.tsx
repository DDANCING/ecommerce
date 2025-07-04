"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";

export function CartButton() {
  const [isMounted, setIsMounted] = useState(false);

  const itemCount = useCart((state) => state.getCartItemCount());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Link href="/cart" className="flex gap-1">
      Carrinho
      {itemCount > 0 && (
        <span className="bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}