import { db } from "@/lib/db";
import ProductCard from "../_components/ui/product-card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { auth } from "@/auth";



export default async function ProductsPage() {
const user = await auth();
const userId = user?.user.id;

  // Fetch products that are featured and not archived

const Products = await db.product.findMany({
      where: {
        isArchived: false,
      },
      select: {
        id: true,
        name: true,
        price: true,
        isFeatured: true,
        isArchived: true,
        originalPrice: true,
        rating: true,
        description: true,
        reviewCount: true,
        sku: true,
        wishlists: {
          select: {
            id: true,
            userId: true,
          },
        },
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
      },
    },
  )

const products = Products.map((product) => {
  return {
    ...product,
    price: product.price.toNumber(),
    originalPrice: product.originalPrice?.toNumber() ?? null,
    rating: product.rating ?? undefined,
    description: product.description ?? undefined,
    reviewCount: product.reviewCount ?? undefined,
    sku: product.sku ?? 0,
    initialInWishlist: product.wishlists.some((wishlist) => wishlist.userId === userId),
  };
});

  const isWishlist = Products.map((product) => {
    return product.wishlists.some((wishlist) => wishlist.userId === userId);
  });

 return (
  <div className="w-screen flex flex-col flex-wrap items-center justify-center gap-4 mt-24">
    <div className="w-[90%]">
    <div className="w-full mb-10">
      <Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Produtos</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 my-4 mx-auto">
 {products.map((product) => ( 
  <ProductCard initialInWishlist={product.initialInWishlist} key={product.id} product={product} />
))}
</div>
    </div>
  </div>
);

}
