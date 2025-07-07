"use client";

import Image from "next/image";
import { useState, useMemo, useTransition } from "react";
import useCart from "@/hooks/use-cart";
import { formatter } from "@/lib/utils";
import { getFretes } from "@/actions/getFretes";

export default function CartPage() {
  const cart = useCart();

  const [cepDestino, setCepDestino] = useState("");
  const [fretes, setFretes] = useState<
    { id: string; name: string; price: number; delivery_time: number }[]
  >([]);
  const [freteSelecionado, setFreteSelecionado] = useState<null | {
    price: number;
    name: string;
    delivery_time: number;
  }>(null);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const TAX_RATE = 0.1;
  const PROMO_DISCOUNT = 0.2;

  const subtotal = useMemo(
    () => cart.items.reduce((acc, item) => acc + item.price, 0),
    [cart.items]
  );

  const discount = promoApplied ? subtotal * PROMO_DISCOUNT : 0;
  const deliveryCost = freteSelecionado?.price || 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal - discount + deliveryCost + tax;

  const handleApplyPromo = () => {
    if (promoCode.trim()) setPromoApplied(true);
  };

  const formatPrice = (value: number) => formatter.format(value);

  const buscarFretes = () => {
    if (!cepDestino || cart.items.length === 0) return;

    const products = cart.items.map((item) => ({
      name: item.name,
      quantity: 1,
      unitary_value: item.price,
      height: 10,
      width: 10,
      length: 10,
      weight: 0.3,
    }));

    startTransition(async () => {
      const resultado = await getFretes("01001-000", cepDestino, products);
      setFretes(resultado || []);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-25 m-5">
      {/* Cart items */}
      <section className="lg:col-span-8 space-y-4">
        <h2 className="text-lg font-bold">Carrinho</h2>

        {cart.items.length === 0 && (
          <p className="text-muted-foreground">Seu carrinho está vazio.</p>
        )}

        {cart.items.map((item) => (
          <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden">
              <Image
                src={item.images[0].url}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.color.name} • {item.size.name}
                  </p>
                </div>
                <span className="font-semibold">{formatPrice(item.price)}</span>
              </div>
              <div className="flex gap-4 text-sm mt-2">
                <button onClick={() => {}} className="text-primary underline">
                  Salvar
                </button>
                <button
                  onClick={() => cart.removeItem(item.id)}
                  className="text-destructive underline"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Summary */}
      <aside className="lg:col-span-4 space-y-6">
        <h2 className="text-lg font-semibold">Resumo</h2>

        {/* Delivery */}
        <div className="space-y-2">
          <h3 className="font-medium">Entrega</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Digite o CEP"
              value={cepDestino}
              onChange={(e) => setCepDestino(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={buscarFretes}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              Buscar
            </button>
          </div>

          {isPending && (
            <p className="text-sm text-muted-foreground">Buscando fretes...</p>
          )}

          {fretes.length > 0 && (
            <div className="space-y-2 mt-2">
              {fretes.map((frete) => (
                <button
                  key={frete.id}
                  onClick={() =>
                    setFreteSelecionado({
                      price: parseFloat(frete.price.toString()),
                      name: frete.name,
                      delivery_time: frete.delivery_time,
                    })
                  }
                  className={`w-full text-left px-3 py-2 border rounded-lg text-sm ${
                    freteSelecionado?.name === frete.name
                      ? "border-primary font-medium"
                      : "border-muted"
                  }`}
                >
                  {frete.name} - R$ {parseFloat(frete.price.toString()).toFixed(2)} (
                  {frete.delivery_time} dias úteis)
                </button>
              ))}
            </div>
          )}

          {freteSelecionado && (
            <p className="text-sm text-muted-foreground">
              Selecionado: {freteSelecionado.name} –{" "}
              {formatPrice(freteSelecionado.price)} ({freteSelecionado.delivery_time} dias úteis)
            </p>
          )}
        </div>

        {/* Promo */}
        <div className="space-y-2">
          <h3 className="font-medium">Cupom</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Digite o cupom"
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={handleApplyPromo}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              Aplicar
            </button>
          </div>
          {promoApplied && (
            <p className="text-xs text-emerald-600">20% de desconto aplicado!</p>
          )}
        </div>

        {/* Totais */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Desconto</span>
            <span>-{formatPrice(discount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Entrega</span>
            <span>{formatPrice(deliveryCost)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxas</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t mt-2">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-2">
          <button
            disabled={cart.items.length === 0}
            className="w-full py-3 rounded-lg bg-primary text-white disabled:opacity-50"
          >
            Finalizar compra
          </button>
          <button className="w-full py-3 rounded-lg border">Continuar comprando</button>
        </div>
      </aside>
    </div>
  );
}
