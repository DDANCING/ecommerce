import { Color, Product, Size } from "@prisma/client";

export type SafeProduct = Omit<Product, "price"> & {
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

export interface Billboard {
  id: string;
  name: string;
  imageUrl: string;
};

export interface Category { 
  id: string;
  name: string;
  billboard: Billboard;
}