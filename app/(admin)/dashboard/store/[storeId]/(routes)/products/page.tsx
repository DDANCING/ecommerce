import { format, formatRelative, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { db } from "@/lib/db";
import { ProductClient } from "./_components/client";
import { ProductColumn } from "./_components/columns";
import { formatter } from "@/lib/utils";


interface BillboardsPageProps {
  params: Promise<{ storeId: string }>;
}

const ProductsPage = async ({ params }: BillboardsPageProps) => {
  
  const { storeId } = await params;

  const products = await db.product.findMany({
    where: {
      storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedProducts: ProductColumn[] = products.map((item) => {
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
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      price: formatter.format(item.price.toNumber()),
      category: item.category.name,
      size: item.size.name,
      color: item.color.value,
      createdAt: dataFormatada,
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formatedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;