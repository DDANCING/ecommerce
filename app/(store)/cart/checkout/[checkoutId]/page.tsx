import NotFound from "@/app/not-found";
import { auth } from "@/auth";
import { db } from "@/lib/db";

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
    },
  });

  if (!order) {
    return NotFound;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 mt-20">Checkout</h1>
      <div className=" p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Buyer:</strong> {order.buyer.fullName}</p>
        <p><strong>Email:</strong> {order.buyer.email}</p>
        <p><strong>Total Amount:</strong> {order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}</p>
        <p><strong>Status:</strong> {order.status}</p>
        
      </div>
    </div>
  )
}
export default checkoutPage;
