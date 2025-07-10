import { formatter } from "@/lib/utils";
import { SafeOrder } from "@/app/types";
import Image from "next/image";

interface OrderCardProps {
  order: SafeOrder;
  userName: string;
}

function formatDate(date: Date | string | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date: Date | string | undefined) {
  if (!date) return "";
  return new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderCard({ order, userName }: OrderCardProps) {
  const orderNumber = order.id;
  const totalProducts = order.orderItems.length;
  const buyerName = userName;
  const createdAt = order.createdAt;
  const deliveryStatus = order.status;
  const deliveryDate = order.createdAt;
  const total = typeof order.totalAmount === "number"
    ? order.totalAmount
    : 0;

  return (
    <div className="bg-background border rounded-xl p-6 shadow-sm">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-lg">
            Order #: {orderNumber}
          </span>
          <span className="text-gray-500 text-sm">
            {totalProducts} Products | By {buyerName} | {formatDateTime(createdAt)}
          </span>
        </div>
      </div>
      <hr className="mb-3" />

      {/* Detalhes da entrega */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="flex flex-col gap-1 text-sm">
          <div>
            <span className="text-gray-500">Status: </span>
            <span className="text-orange-500 font-medium">{deliveryStatus}</span>
          </div>
          <div>
            <span className="text-gray-500">Date of delivery: </span>
            <span>{formatDate(deliveryDate)}</span>
          </div>
          <div>
            <span className="text-gray-500">Rastreio: </span>
            <span>{/*/ TODO: RASTREIO /*/}</span>
          </div>
        </div>
        <div className="text-base font-semibold">
          <span className="text-gray-500">Total:</span>{" "}
          <span className="text-foreground">{formatter.format(total)}</span>
        </div>
      </div>

      {/* Lista de produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        {order.orderItems.map((item) => {
          const product = item.product;
          return (
            <div key={item.product.id} className="flex gap-3 bg-background rounded-lg p-2 items-center border">
              <div className="w-14 h-14 relative flex-shrink-0 rounded-lg overflow-hidden border bg-white">
                {product?.images?.[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm truncate">{product?.name || "Product name"}</div>
                <div className="text-xs text-gray-500">
                  Quantity: {item.quantity}x = {product ? formatter.format(Number(product.price)) : "-"}
                </div>
                <div className="text-xs text-gray-500">
                  Color: {product?.color?.name || "-"}
                </div>
                <div className="text-xs text-gray-500">
                  Size: {product?.size?.name || "-"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}