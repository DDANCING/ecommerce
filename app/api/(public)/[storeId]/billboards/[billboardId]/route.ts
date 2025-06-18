/* eslint-disable react-hooks/rules-of-hooks */
import { useUserId } from "@/data/hooks/use-current-id";
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  context: { params: Promise<{  billboardId: string }> }
) {
  try {
    const { billboardId } = await context.params;


    if (!billboardId) {
      return new NextResponse("billboard ID is required", { status: 400 });
    }


    const billboard = await db.billboard.findUnique({
      where: {
        id: billboardId,
       
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ storeId: string, billboardId: string }> }
) {
  try {
    const userId = await useUserId(req);
    const body = await req.json();
    const { label, imageUrl } = body;
    const { billboardId, storeId } = await context.params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Image Url is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
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
    

    const billboard = await db.billboard.updateMany({
      where: {
        id: billboardId,
      },
      data: {
       label,
       imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ storeId: string, billboardId: string }> }
) {
  try {
    const userId = await useUserId(req);
    const { storeId, billboardId } = await context.params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!billboardId) {
      return new NextResponse("billboard ID is required", { status: 400 });
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

    const billboard = await db.billboard.deleteMany({
      where: {
        id: billboardId,
       
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

