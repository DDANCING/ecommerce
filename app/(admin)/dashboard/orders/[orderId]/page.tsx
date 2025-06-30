import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { OrderForm } from "./_components/order-form";

interface  BuyerIdPageProps {
  params: Promise<{ orderId: string }>
}

const OrderIdPage = async ({ params }: BuyerIdPageProps) => {
  const { orderId } = await params;

const rawOrder = await db.order.findUnique({
  where: { id: orderId },
  include: {
    orderItems: {
      select: {
        product: {
          include: {
            color: true,
            size: true,
          },
        },
        quantity: true,
        unitPrice: true,
        subtotal: true,
      },
    },
  },
});

const order = rawOrder
  ? {
      ...rawOrder,
      totalAmount: rawOrder.totalAmount?.toNumber() ?? 0,
      orderItems: rawOrder.orderItems.map((item) => ({
        ...item,
        unitPrice: item.unitPrice.toNumber(),
        subtotal: item.subtotal.toNumber(),
        product: {
          ...item.product,
          price: item.product.price.toNumber(),
          // Serialize nested Decimal fields if necessary
        },
      })),
      product: rawOrder.orderItems.map((item) => ({ id: item.product.id })),
    }
  : null;

  const buyers = await db.buyer.findMany({}
 );

  const rawProducts = await db.product.findMany({
  include: { color: true, size: true },
});

const products = rawProducts.map((product) => ({
  ...product,
  price: product.price.toNumber(),
}));
  

  
  return (
    <div className="flex-col">
     
        <OrderForm buyers={buyers} products={products} initialData={order} orderId={orderId} isModal={false}/>
      
    </div>
  );
};

export default OrderIdPage;
