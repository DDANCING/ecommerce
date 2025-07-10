
import { db } from "@/lib/db";
import CategoryGrid from "./_components/CategoryGrid";


export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    where: {
      products: {
        some: {},
      },
    },
    include: {
      billboard: {
        select: {
          imageUrl: true,
        },
      },
    },
  });

  return <CategoryGrid categories={categories} />;
}
