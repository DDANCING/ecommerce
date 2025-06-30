import { format, formatRelative, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { db } from "@/lib/db";
import { BuyerClient } from "./_components/client";
import { BuyerColumn } from "./_components/columns";

const BuyersPage = async () => {
  const buyers = await db.buyer.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedBuyers: BuyerColumn[] = buyers.map((item) => {
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
      fullName: item.fullName,
      email: item.email,
      phone: item.phone,
      createdAt: dataFormatada,
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BuyerClient data={formatedBuyers} />
      </div>
    </div>
  );
};

export default BuyersPage;
