"use server";

export async function getFretes(fromCep: string, toCep: string, products: any[]) {
    console.log("Token de ambiente carregado:", !!process.env.MELHOR_ENVIO_TOKEN);
  try {
    

    const response = await fetch("https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "MinhaLoja (marcmaker@outlook.com)" // Adicione seu email real aqui
      },
      body: JSON.stringify({
        from: { postal_code: fromCep },
        to: { postal_code: toCep },
        products,
        options: {
          receipt: false,
          own_hand: false
        },
        services: "1,2,18" // ou os IDs de serviços que quiser
      }),
    });

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Resposta inesperada:", data);
      throw new Error("Resposta inesperada da API");
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar fretes:", error);
    return [];
  }
}
