"use server";

export async function getFretes(fromCep: string, toCep: string, products: any[]) {
  try {
    const token = process.env.MELHOR_ENVIO_CLIENT_SECRET;

    if (!token) {
      throw new Error("Token MELHOR_ENVIO_CLIENT_SECRET não definido.");
    }

    const DEFAULT_MEASUREMENTS = {
      width: 10,
      height: 10,
      length: 10,
      weight: 0.3,
      insurance_value: 10.0,
      quantity: 1,
    };

    const normalizedProducts = products.map((product, index) => ({
      id: product.id || `item-${index}`,
      width: product.width || DEFAULT_MEASUREMENTS.width,
      height: product.height || DEFAULT_MEASUREMENTS.height,
      length: product.length || DEFAULT_MEASUREMENTS.length,
      weight: product.weight || DEFAULT_MEASUREMENTS.weight,
      insurance_value: product.insurance_value || DEFAULT_MEASUREMENTS.insurance_value,
      quantity: product.quantity || DEFAULT_MEASUREMENTS.quantity,
    }));

    const url = "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate";
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "Cris Mazzonetto (marcmaker@outlook.com)",
    };

    const body = {
      from: { postal_code: fromCep },
      to: { postal_code: toCep },
      products: normalizedProducts,
      options: {
        receipt: false,
        own_hand: false,
      },
      services: "1,2,18",
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da API:", data);
      throw new Error(data?.message || "Erro na resposta da API");
    }

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
