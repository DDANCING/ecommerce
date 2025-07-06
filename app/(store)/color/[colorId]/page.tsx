import { db } from "@/lib/db";
import ProductCard from "../../_components/ui/product-card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface  ColorIdPageProps {
  params: Promise<{ colorId: string }>
}


export default async function ColorPage({ params }: ColorIdPageProps) {

 const { colorId } = await params;
const products = await db.product.findMany({
 where: {
  colorId,
 },
 include: {
   category: {
          select: {
            id: true,
            name: true,
          },
        },
        size: {
          select: {
            id: true,
            name: true,
            value: true,
          },
        },
        color: {
          select: {
            id: true,
            name: true,
            value: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
          },
        },
      }
  })

const transformedProducts = products.map((product) => ({
  ...product,
  price: product.price.toNumber(),
  originalPrice: product.originalPrice?.toNumber() ?? null,
  rating: product.rating ?? undefined,
  description: product.description ?? undefined,
  reviewCount: product.reviewCount ?? undefined,
  sku: product.sku ?? 0,
}));

 return (
  <div className="w-screen flex flex-col flex-wrap items-center justify-center gap-4 mt-24">
    <div className="w-[80%]">
    <div className="w-full mb-10">
    <h1 className="text-2xl font-bold">{products[0]?.color.name}</h1>
      <Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/color">Cores</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>{products[0]?.color.name}</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  gap-4 my-4 mx-auto">
  {transformedProducts.map((product) => ( 
  <ProductCard key={product.id} product={product} />
))}
</div>
    </div>
  </div>
);

}
