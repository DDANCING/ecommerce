import { db } from "@/lib/db";
import { ProductForm } from "./_components/product-form";

interface ProductIdPageProps {
  params: Promise<{ productId: string, storeId: string }>
}

const ProductIdPage = async (
   { params }:  ProductIdPageProps 
) => {
  const { productId, storeId } = await params;
  const product = await db.product.findUnique({
    where: {
        id: productId
    },
     include: {
      images: true
     }
  });

  const categories = await db.category.findMany({
    where: {
      storeId,
    }
  })

  const sizes = await db.size.findMany({
    where: {
      storeId,
    }
  })

  const colors = await db.color.findMany({
    where: {
      storeId,
    }
  })

  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8">
            <ProductForm
            categories={categories}
            colors={colors}
            sizes={sizes}
            initialData={product}/>
        </div>
     
    </div>
  );
}

export default ProductIdPage;