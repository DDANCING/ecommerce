import { notFound } from "next/navigation";
import ProductClient from "./_components/ProductClient";
import { getProductWithSuggestions } from "@/actions/getProductWithSuggestions";

interface CategoryIdPageProps {
  params: Promise<{ productId: string }>;
}

const page = async ({ params }: CategoryIdPageProps) => {
  const { productId } = await params;

const { product, suggestedProducts } = await getProductWithSuggestions(productId);


if (!product) return notFound();

  return (
    <div className="mt-20">
    <ProductClient
      product={product}
      suggestedProducts={suggestedProducts}
    />
    </div>
  );
};

export default page;
