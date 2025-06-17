import { format, formatRelative, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { db } from "@/lib/db";
import { BillboardClient } from "./_components/client";
import { BillboardColumn } from "./_components/columns";

// 1. Defina a interface com 'params' como uma Promise, igual ao seu exemplo que funciona
interface BillboardsPageProps {
  params: Promise<{ storeId: string }>;
}

const BillboardsPage = async ({ params }: BillboardsPageProps) => {
  // 2. Use 'await' para extrair o conteúdo dos params
  const { storeId } = await params;

  const billboards = await db.billboard.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedBillboards: BillboardColumn[] = billboards.map((item) => {
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
      label: item.label,
      createdAt: dataFormatada,
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formatedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;