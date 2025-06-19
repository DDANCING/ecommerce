import { format, formatRelative, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { db } from "@/lib/db";
import { SizesClient } from "./_components/client";
import { SizeColumn } from "./_components/columns";


interface SizesPageProps {
  params: Promise<{ storeId: string }>;
}

const SizesPage = async ({ params }: SizesPageProps) => {
  
  const { storeId } = await params;

  const sizes = await db.size.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedSizes: SizeColumn[] = sizes.map((item) => {
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
      name: item.name,
      value: item.value,
      createdAt: dataFormatada,
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formatedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;