import { auth } from "@/auth"
import { db } from "@/lib/db";
import { NextResponse } from "next/server"


export async function POST(
  req: Request,
  context: { params: Promise<{ storeId: string }> }
) {
  try {
    const user = await auth();
    const userId = user?.user.id;
    const body = await req.json();
    const { storeId } = await context.params;

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

    // validações
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
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
    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }
    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
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

    const product = await db.product.create({
      data: {
        name,
        price,
        originalPrice,
        sku,
        rating,
        reviewCount,
        description,
        isArchived,
        isFeatured,
        colorId,
        categoryId,
        sizeId,
        storeId,
        images: {
          createMany: {
            data: images.map((image: { url: string }) => image),
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
    req: Request,
    context: { params: Promise<{ storeId: string }> }
) {
try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    const { storeId} = await context.params;

    if (!storeId) {
        return new NextResponse("Store id is required", {status: 400});
    } 
    
    const products = await db.product.findMany({
        where: {
            id: storeId,
            categoryId,
            colorId,
            sizeId,
            isFeatured: isFeatured ? true : undefined,
            isArchived: false
        },
        include: {
            images: true,
            category: true,
            color: true,
            size: true,
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    
  return NextResponse.json(products);
} catch (error) {
    console.log('[PRODUCTS_GET]', error)
    return new NextResponse("Internal error", {status: 500});
 }
};