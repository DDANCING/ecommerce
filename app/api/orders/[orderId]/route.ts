import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

interface OrderItemPayload {
  productId: string;
  quantity: number;
}

// GET /api/orders/:orderId
export async function GET(
  req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;

    if (!orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: true,
        orderItems: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.log("[ORDER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PATCH /api/orders/:orderId

export async function PATCH(
  req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const { orderId } = await context.params;
    const body = await req.json();

    const {
      buyer: buyerData,
      order: orderData,
      orderItems,
    }: {
      buyer: any;
      order: any;
      orderItems?: OrderItemPayload[];
    } = body;

    if (!orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }
    if (!buyerData || !orderData) {
      return new NextResponse("Buyer and Order data are required", {
        status: 400,
      });
    }

    // ✅ Validação de itens
    if (orderItems && orderItems.length > 0) {
      const invalidItems = orderItems.filter(
        (item) => !item.productId || typeof item.quantity !== "number"
      );
      if (invalidItems.length > 0) {
        return new NextResponse("Invalid order items", { status: 400 });
      }
    }

    const currentOrder = await db.order.findUnique({
      where: { id: orderId },
      include: { buyer: true },
    });

    if (!currentOrder) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const updatedOrder = await db.$transaction(async (prisma) => {
      // Atualiza comprador
      await prisma.buyer.update({
        where: { id: currentOrder.buyerId },
        data: buyerData,
      });

      // Atualiza pedido
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          isPaid: orderData.isPaid,
          paymentMethod: orderData.paymentMethod,
          installments: orderData.installments,
          status: orderData.status,
          totalAmount: orderData.totalAmount,
        },
      });

      // Atualiza/insere itens, se houver
      if (orderItems && orderItems.length > 0) {
        const productIds = orderItems
          .map((item) => item.productId)
          .filter((id): id is string => !!id);

        const products = await prisma.product.findMany({
          where: { id: { in: productIds } },
        });

        if (products.length !== productIds.length) {
          const missingIds = productIds.filter(
            (id) => !products.find((p) => p.id === id)
          );
          throw new Error(`Products not found: ${missingIds.join(", ")}`);
        }

        for (const item of orderItems) {
          const product = products.find((p) => p.id === item.productId)!;

          await prisma.orderItem.upsert({
            where: {
              orderId_productId: {
                orderId,
                productId: item.productId,
              },
            },
            update: {
              quantity: { increment: item.quantity },
              subtotal: {
                increment: new Prisma.Decimal(
                  product.price.toNumber() * item.quantity
                ),
              },
            },
            create: {
              orderId,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: product.price,
              subtotal: new Prisma.Decimal(
                product.price.toNumber() * item.quantity
              ),
            },
          });
        }
      }

      return order;
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.log("[ORDER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/orders/:orderId
export async function DELETE(
  req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const { orderId } = await context.params;

    if (!orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    const orderExists = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!orderExists) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const deletedOrder = await db.$transaction(async (prisma) => {
      await prisma.orderItem.deleteMany({
        where: { orderId },
      });

      return await prisma.order.delete({
        where: { id: orderId },
      });
    });

    return NextResponse.json(deletedOrder);
  } catch (error) {
    console.log("[ORDER_DELETE]", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return new NextResponse("Order not found.", { status: 404 });
      }
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}
