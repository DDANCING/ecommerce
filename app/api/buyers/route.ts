import { auth } from "@/auth"
import { db } from "@/lib/db";
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const user = await auth();
    const userId = user?.user.id;
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      address,
      city,
      state,
      neighborhood,
      number,
      cep,
      document,
      complement
    } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!fullName) return new NextResponse("Fullname is required", { status: 400 });
    if (!email) return new NextResponse("email is required", { status: 400 });
   

    // Verifica se já existe comprador com mesmo email ou documento
    const existingBuyer = await db.buyer.findFirst({
      where: {
        OR: [
          { email },
          { document }
        ]
      }
    });

    if (existingBuyer) {
      return NextResponse.json(
        { error: "Email ou documento já registrado." },
        { status: 409 }
      );
    }

    const buyer = await db.buyer.create({
      data: {
        fullName,
        email,
        phone,
        address,
        city,
        state,
        cep,
        document,
        neighborhood,
        number,
        complement,
      }
    });

    return NextResponse.json(buyer);

  } catch (error) {
    console.log('[BUYER_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return new NextResponse("Email is required", { status: 400 });
  }

  const buyer = await db.buyer.findUnique({
    where: { email },
  });

  if (!buyer) {
    return new NextResponse("Buyer not found", { status: 404 });
  }

  return NextResponse.json(buyer);
}
