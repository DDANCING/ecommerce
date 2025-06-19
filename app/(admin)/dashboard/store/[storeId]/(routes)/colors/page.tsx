import { format, formatRelative, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { db } from "@/lib/db";
import { ColorsClient } from "./_components/client";
import { ColorColumn } from "./_components/columns";


interface ColorsPageProps {
  params: Promise<{ storeId: string }>;
}

const ColorsPage = async ({ params }: ColorsPageProps) => {
  
  const { storeId } = await params;

  const colors = await db.color.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedColors: ColorColumn[] = colors.map((item) => {
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
        <ColorsClient data={formatedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;