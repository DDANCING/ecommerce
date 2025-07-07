"use server";

export async function getFretes(fromCep: string, toCep: string, products: any[]) {
  try {
    const response = await fetch("https://api.melhorenvio.com.br/api/v2/me/shipment/calculate", {
      method: "POST",
      headers: {
        Authorization: `Bearer 0qXlxjtAXXyaOvBHPN5eB0WZMG7uwGqjyx9m0QPZ`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        from: { postal_code: fromCep },
        to: { postal_code: toCep },
        products,
      }),
    });

    const data = await response.json();

    // Opcional: você pode validar se veio um array
    if (!Array.isArray(data)) {
      throw new Error("Resposta inesperada da API");
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar fretes:", error);
    return [];
  }
}
