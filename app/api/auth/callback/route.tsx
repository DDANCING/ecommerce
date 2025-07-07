
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Código de autorização ausente." }, { status: 400 });
  }

  const client_id = process.env.MELHOR_ENVIO_CLIENT_ID!;
  const client_secret = process.env.MELHOR_ENVIO_CLIENT_SECRET!;
  const redirect_uri = process.env.MELHOR_ENVIO_REDIRECT_URI!;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id,
    client_secret,
    redirect_uri,
    code,
  });

  try {
    const tokenResponse = await fetch("https://sandbox.melhorenvio.com.br/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body,
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return NextResponse.json({ error: tokenData }, { status: tokenResponse.status });
    }

    // Aqui você pode salvar o token no banco de dados ou sessão, etc.
    console.log("Token recebido da Melhor Envio:", tokenData);

    return NextResponse.json({ success: true, tokenData });
  } catch (error) {
    console.error("Erro ao trocar código por token:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
