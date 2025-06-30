import { format, formatRelative, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { db } from "@/lib/db";
import { OrderClient } from "./_components/client";
import { OrderColumn } from "./_components/columns";
import { formatter } from "@/lib/utils";

const OrdersPage = async () => {
  const orders = await db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      buyer: {
        select: {
          fullName: true,
          email: true,   
          phone: true,
        },
      },
    }
  });

  const formatedOrders: OrderColumn[] = orders.map((item) => {
  const createdDate = new Date(item.createdAt);
  const hoje = new Date();
  const diasDeDiferenca = differenceInDays(hoje, createdDate);

  let dataFormatada: string;

  if (diasDeDiferenca > 30) {
    dataFormatada = format(createdDate, "dd/MM/yyyy", { locale: ptBR });
  } else {
    dataFormatada = formatRelative(createdDate, hoje, { locale: ptBR });
  }

  return {
    id: item.id,
    fullName: item.buyer.fullName,
    email: item.buyer.email,
    phone: item.buyer.phone,
    isPaid: item.isPaid,
    method: item.paymentMethod ?? "",
    totalAmount: item.totalAmount
    ? formatter.format(item.totalAmount.toNumber()) 
    : "R$ 0,00",
    sent: item.status ?? "",
    createdAt: dataFormatada,
    installments: item.installments ?? 0,
  };
});

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formatedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
