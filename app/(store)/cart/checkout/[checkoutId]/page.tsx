import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import CheckoutClientForm from "./_components/checkout-client-form";

interface CheckoutIdPageProps {
  params: Promise<{ checkoutId: string }>;
}

const checkoutPage = async ({ params }: CheckoutIdPageProps) => {
  const { checkoutId } = await params;
  const user = await auth();

  const order = await db.order.findUnique({
    where: {
      id: checkoutId,
      buyer: {
        email: user?.user?.email || "",
      }
    },
    include: {
      buyer: true,
      orderItems: {
        select: {
          product: {
            select: {
              id: true,
              sku: true,
              name: true,
              price: true,
              images: true,
            }
          },
          quantity: true,
        }
      },
      coupon: true, 
    }
  });

  if (!order) {
    notFound();
  }

  
  const orderWithNumberPrice = {
    ...order,
    buyer: {
      ...order.buyer,
      name: order.buyer.fullName || "", 
      email: order.buyer.email,
    },
    sku:
      order.orderItems && order.orderItems.length > 0
        ? (order.orderItems[0].product.sku !== null && order.orderItems[0].product.sku !== undefined
            ? String(order.orderItems[0].product.sku)
            : "")
        : "",
    totalAmount: typeof order.totalAmount === "number" ? order.totalAmount : Number(order.totalAmount),
    orderItems: order.orderItems.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: typeof item.product.price === "number" ? item.product.price : Number(item.product.price),
        sku: item.product.sku !== null && item.product.sku !== undefined ? String(item.product.sku) : "",
        images: Array.isArray(item.product.images)
          ? item.product.images.map((img) => typeof img === "string" ? img : img.url)
          : [],
      },
    })),
    shippingMethod: order.shippingMethod === null ? undefined : order.shippingMethod,
    shippingCost:
      order.shippingCost === null || order.shippingCost === undefined
        ? undefined
        : typeof order.shippingCost === "number"
        ? order.shippingCost
        : Number(order.shippingCost),
    coupon:
      typeof order.coupon === "undefined" || order.coupon === null
        ? null
        : {
            id: order.coupon.id,
            discountType:
              order.coupon.discountType === "fixed" || order.coupon.discountType === "percentage"
                ? order.coupon.discountType as "fixed" | "percentage"
                : "fixed", // fallback to "fixed" if not matching
            discountValue:
              typeof order.coupon.discountValue === "number"
                ? order.coupon.discountValue
                : Number(order.coupon.discountValue),
            isActive:
              typeof order.coupon.usageLimit === "undefined" || order.coupon.usageLimit === null
                ? order.coupon.expiresAt === null ||
                  new Date(order.coupon.expiresAt) > new Date() // consider coupon active if
                : // fallback: consider coupon active if not expired and usage limit not reached
                  (order.coupon.expiresAt === null ||
                    new Date(order.coupon.expiresAt) > new Date()) &&
                  (order.coupon.usageLimit === null ||
                    order.coupon.usedCount < order.coupon.usageLimit),
          },
    couponId: typeof order.couponId === "undefined" ? null : order.couponId,
  };


  return (
    <div>
      <CheckoutClientForm order={orderWithNumberPrice}/>
    </div>
  );
};

export default checkoutPage;
