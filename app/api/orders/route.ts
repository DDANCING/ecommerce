import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";


interface OrderItemPayload {
  productId: string;
  quantity: number;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await req.json();

    const {
      buyer: buyerData,
      order: orderData,
      orderItems,

    } = body;

    if (!buyerData) {
        return new NextResponse("Buyer data is required", { status: 400 });
    }
    if (!orderData) {
        return new NextResponse("Order data is required", { status: 400 });
    }
    if (!orderItems || orderItems.length === 0) {
      return new NextResponse("Order items are required", { status: 400 });
    }

    const buyer = await db.buyer.upsert({
      where: { email: buyerData.email },
      update: buyerData,
      create: buyerData,
    });


    const productIds = orderItems.map((item: OrderItemPayload) => item.productId);

    const productsInDb = await db.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
    
    
    if (productsInDb.length !== productIds.length) {
        return new NextResponse("One or more products not found.", { status: 404 });
    }

    
    const newOrder = await db.$transaction(async (prisma) => {
        
        const createdOrder = await prisma.order.create({
            data: {
                buyerId: buyer.id,
                isPaid: orderData.isPaid,
                paymentMethod: orderData.paymentMethod,
                installments: orderData.installments,
                status: orderData.status,
                totalAmount: orderData.totalAmount,
                shippingMethod: orderData.shippingMethod || "N/S", 
                shippingCost: orderData.shippingCost || 0,
                couponId: orderData.couponId || null,
            },
        });

       
        const orderItemsToCreate = orderItems.map((item: OrderItemPayload) => {
            const product = productsInDb.find(p => p.id === item.productId);
            if (!product) {
              
                throw new Error(`Product with ID ${item.productId} not found during transaction.`);
            }
            return {
                orderId: createdOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: product.price, 
                subtotal: new Prisma.Decimal(product.price.toNumber() * item.quantity),
            };
        });

      
        await prisma.orderItem.createMany({
            data: orderItemsToCreate,
        });
        
        return createdOrder;
    });


    return NextResponse.json(newOrder, { status: 201 });

  } catch (error) {
    console.log('[ORDER_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}