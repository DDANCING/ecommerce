"use server";

import { db } from "@/lib/db";

export const getBillboardData = async () => {
  const data = await db.billboard.findMany({
    select: {
      id: true,
      label: true,
      imageUrl: true,
      subtitle: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      storeId: true,
      callToAction: {
        select: {
          href: true,
          text: true,
        },
      },
      categories: {
        select: {
          id: true,
          name: true,
          products: {
            where: {
              isArchived: false,
              isFeatured: true,
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
        },
      },
    },
  });

  const billboardData = data.map((item) => ({
    id: item.id,
    title: item.label,
    subtitle: item.subtitle ?? undefined,
    description: item.description ?? undefined,
    imageUrl: item.imageUrl,
    storeId: item.storeId,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    callToAction: item.callToAction
      ? {
          text: item.callToAction.text ?? undefined,
          href: item.callToAction.href ?? undefined,
        }
      : undefined,
    categories: item.categories.map((category) => {
      const randomProducts = [...category.products]
        .sort(() => 0.5 - Math.random()) // embaralha
        .slice(0, 3); // pega até 3

      return {
        id: category.id,
        name: category.name,
        products: randomProducts.map((product) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          isFeatured: product.isFeatured,
          isArchived: product.isArchived,
          originalPrice: product.originalPrice
            ? Number(product.originalPrice)
            : undefined,
          rating: product.rating ?? undefined,
          description: product.description ?? undefined,
          reviewCount: product.reviewCount ?? undefined,
          size: {
            id: product.size.id,
            name: product.size.name,
            value: product.size.value,
          },
          color: {
            id: product.color.id,
            name: product.color.name,
            value: product.color.value,
          },
          images: product.images.map((img) => ({
            id: img.id,
            url: img.url,
          })),
        })),
      };
    }),
  }));

  const firstProduct =
    billboardData[0]?.categories[0]?.products[0] ?? null;

  return {
    billboardData,
    firstProduct,
  };
};
