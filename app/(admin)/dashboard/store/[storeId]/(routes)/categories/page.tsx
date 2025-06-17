import { format, formatRelative, differenceInDays } from "date-fns";
import { ptBR, tr } from "date-fns/locale";

import { db } from "@/lib/db"
import { BillboardClient } from "./_components/client"
import { CategoriesColumn } from "./_components/columns";

interface CategoriesPageProps {
  params: Promise<{ storeId: string }>;
}

const categoriesPage = async ({ params }: CategoriesPageProps) => {

    const { storeId } = await params;

    const categories = await db.category.findMany({
        where: {
            storeId,
        },
        include: {
            billboard: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formatedCategories: CategoriesColumn[] = categories.map((item) => {
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
      label: item.name,
      billboardLabel: item.billboard.label,
      createdAt: dataFormatada,
    };
  });

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={formatedCategories} />
            </div>
        </div>
    )
}
export default categoriesPage