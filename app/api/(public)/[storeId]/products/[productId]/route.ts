/* eslint-disable react-hooks/rules-of-hooks */
import { useUserId } from "@/data/hooks/use-current-id";
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  context: { params: Promise<{  productId: string }> }
) {
  try {
    const { productId } = await context.params;


    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }


    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ storeId: string; productId: string }> }
) {
  try {
    const userId = await useUserId(req);
    const body = await req.json();
    const {
  name,
  price,
  originalPrice,
  sku,
  rating,
  reviewCount,
  description,
  categoryId,
  colorId,
  sizeId,
  images,
  isFeatured,
  isArchived,
} = body;
    const { productId, storeId } = await context.params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }
    if (!productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

 
    const product = await db.$transaction(async (tx) => {
      
      await tx.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        originalPrice,
        sku,
        rating,
        reviewCount,
        description,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

      // Depois cria as novas imagens
      return await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          images: {
            createMany: {
              data: images.map((image: { url: string }) => image),
            },
          },
        },
      });
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ storeId: string, productId: string }> }
) {
  try {
    const userId = await useUserId(req);
    const { storeId, productId } = await context.params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!productId) {
      return new NextResponse("product ID is required", { status: 400 });
    }

           const storeByUserId = await db.store.findFirst({
        where: {
            id: storeId,
            userId,
        }
    });

    if(!storeByUserId) {
        return new NextResponse("Unauthorized", {status: 403});
    }

    const product = await db.product.deleteMany({
      where: {
        id: productId,
       
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

