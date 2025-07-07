import { notFound } from "next/navigation";
import ProductClient from "./_components/ProductClient";
import { getProductWithSuggestions } from "@/actions/getProductWithSuggestions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface CategoryIdPageProps {
  params: Promise<{ productId: string }>;
}

const page = async ({ params }: CategoryIdPageProps) => {
  const { productId } = await params;

  const { product, suggestedProducts } = await getProductWithSuggestions(productId);

  if (!product) return notFound();

  if (product.isArchived === true) {
    return (
      <div className="relative mt-20">
        <Card className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center text-center px-4">
          <div className="bg-background p-6 rounded-lg shadow-xl max-w-md">
            <h1 className="text-xl font-semibold mb-4">
              Este produto está indisponível no momento.
            </h1>
            <p>
              Para mais informações, entre em{" "}
              <a href="/contato" className="text-blue-600 underline font-medium">
                contato
              </a>.
            </p>
            <div className="flex justify-end mt-4 gap-4">
            <Link href="/products">
            <Button variant={"secondary"}>  Catálogo </Button>
            </Link>
            <Link href="/">
            <Button >  Inicio </Button>
            </Link>
            </div>
          </div>
        </Card>

        <ProductClient
          product={product}
          suggestedProducts={suggestedProducts}
        />
      </div>
    );
  }

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
