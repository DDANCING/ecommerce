import { Color, Product, Size } from "@prisma/client";

export type SafeProduct = Omit<Product, "price"> & {
  images?: { id: string; url: string }[];
  price: number;
  color: Color;
  size: Size;
};

export type SafeOrder = {
  id: string;
  buyerId: string;
  createdAt: Date;
  updatedAt: Date;
  isPaid: boolean;
  status: string | null;
  paymentMethod: string | null;
  installments: number | null;
  totalAmount: number;
  product: { id: string }[];
  orderItems: {
    product: SafeProduct;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
};

export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  isFeatured: boolean;
  isArchived: boolean;
  originalPrice?: number | null; 
  rating?: number;
  description?: string;
  reviewCount?: number;
  onAdd?: () => void;
  onFavorite?: () => void;
  enableAnimations?: boolean;
  sku?: number;
  category: {
    id: string;
    name: string;
  }
  size: {
    id: string;
    name: string;
    value: string;
  };
  color: {
    id: string;
    name: string;
    value: string;
  };
  images: {
    id: string;
    url: string;
  }[];
}

export interface Billboard {
  id?: string;
  title: string;
  subtitle?: string;
  category?: {
    id: string;
    name: string;
    products: StoreProduct[];
  };
  description?: string;
  imageUrl: string;
  callToAction?: {
    text?: string;
    href?: string;
  };
  storeId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface Category { 
  id: string;
  name: string;
  billboard: Billboard;
}
