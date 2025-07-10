"use client";

import Image from "next/image";
import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";

import { formatter, cn } from "@/lib/utils";
import useCart from "@/hooks/use-cart";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { countries } from "@/lib/countries";

interface CartClientProps {
  user: {
    name: string;  
    email: string;
  };
}

export default function CartClient({ user }: CartClientProps) {
  const cart = useCart();
  const router = useRouter();

  const [cepDestino, setCepDestino] = useState("");
  const [pais, setPais] = useState("Brasil");
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
  const [cupomValido, setCupomValido] = useState<null | {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
}>(null);
  const [isPending, startTransition] = useTransition();

  

  const subtotal = useMemo(
    () => cart.items.reduce((acc, item) => acc + item.price, 0),
    [cart.items]
  );

  const discount = promoApplied && cupomValido
  ? cupomValido.discountType === "percentage"
    ? subtotal * (cupomValido.discountValue / 100) 
    : cupomValido.discountValue
  : 0;
  const deliveryCost = freteSelecionado?.price || 0;
  const total = subtotal - discount + deliveryCost;


  const formatPrice = (value: number) => formatter.format(value);

const handleApplyPromo = async () => {
  if (!promoCode.trim()) return;

  try {
    const res = await fetch(`/api/coupons?code=${promoCode}`);
    if (!res.ok) throw new Error("Cupom inválido");

    const cupom = await res.json();

    // Verifica expiração e limite de uso
    const agora = new Date();
    const expiraEm = new Date(cupom.expiresAt);
    if ((cupom.usageLimit && cupom.usedCount >= cupom.usageLimit) || expiraEm < agora) {
      alert("Cupom expirado ou limite atingido.");
      return;
    }

    setCupomValido({
      id: cupom.id,
      code: cupom.code,
      discountType: cupom.discountType,
      discountValue: parseFloat(cupom.discountValue),
    });

    setPromoApplied(true);
  } catch (err) {
    console.error("Erro ao aplicar cupom:", err);
    alert("Cupom inválido ou expirado.");
    setPromoApplied(false);
    setCupomValido(null);
  }
};
  const buscarFretes = () => {
    if (!cepDestino || cart.items.length === 0) return;

    const quantidade = cart.items.length;
    const isInternacional = cepDestino.length < 8 || /\D/.test(cepDestino);

    const args: any = {
      sCepOrigem: "85812011",
      sCepDestino: cepDestino.replace("-", ""),
      quantidade,
    };

    if (isInternacional) args.paisDestino = pais;

    startTransition(async () => {
      try {
        const res = await fetch("/api/correios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(args),
        });

        if (!res.ok) throw new Error("Erro ao buscar fretes");

        const result = await res.json();

        if (!Array.isArray(result)) {
          console.error("Resposta inesperada da API de frete");
          setFretes([]);
          return;
        }

        const servicos = result.map((s: any) => ({
          id: s.id,
          name: s.name,
          price: parseFloat(s.price.toFixed(2)),
          delivery_time: s.delivery_time,
        }));

        setFretes(servicos);
      } catch (error) {
        console.error("Erro ao buscar fretes:", error);
        setFretes([]);
      }
    });
  };

  const finalizarCompra = async () => {
    if (!freteSelecionado) return;

    try {
      let buyer;

      // 1. Criação ou obtenção do comprador
      const buyerRes = await fetch("/api/buyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: user.name,
          email: user.email,
          phone: "00000000000",
          address: "Rua Exemplo",
          city: "Cidade",
          state: "UF",
          neighborhood: "Bairro",
          number: "123",
          cep: cepDestino,
          document: "00000000000",
          complement: "Complemento",
        }),
      });

      if (buyerRes.status === 409) {
        const existingBuyer = await fetch(`/api/buyers?email=${user.email}`);
        if (!existingBuyer.ok) throw new Error("Erro ao buscar comprador existente");
        buyer = await existingBuyer.json();
      } else if (!buyerRes.ok) {
        const error = await buyerRes.text();
        throw new Error("Erro ao criar comprador: " + error);
      } else {
        buyer = await buyerRes.json();
      }

      const orderRes = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buyer,
        order: {
          isPaid: false,
          paymentMethod: "N/S",
          installments: 1,
          status: "PENDING",
          totalAmount: total,
          shippingMethod: freteSelecionado.name,
          shippingCost: freteSelecionado.price, 
          couponId: cupomValido?.id || null,
        },
        orderItems: cart.items.map((item) => ({
          productId: item.id,
          quantity: 1,
        })),
      }),
    });

      if (!orderRes.ok) {
        const error = await orderRes.text();
        throw new Error("Erro ao criar pedido: " + error);
      }

      const order = await orderRes.json();

      cart.removeAll();
      router.push(`/cart/checkout/${order.id}`);
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      alert("Erro ao finalizar compra. Verifique os dados e tente novamente.");
    }
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
   
           {/* Entrega */}
           <div className="space-y-2">
             <h3 className="font-medium">Entrega</h3>
   
             {/* Popover de País */}
             <Popover>
               <PopoverTrigger asChild>
                 <Button
                   variant="outline"
                   role="combobox"
                   className="w-full justify-between"
                 >
                   {pais} <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                 </Button>
               </PopoverTrigger>
               <PopoverContent className="w-full p-0">
                 <Command>
                   <CommandInput placeholder="Buscar país..." className="h-9" />
                   <CommandList>
                     {countries.map((c) => (
                       <CommandItem
                         key={c}
                         value={c}
                         onSelect={() => setPais(c)}
                       >
                         {c}
                         {pais === c ? (
                           <Check className="ml-auto h-4 w-4" />
                         ) : null}
                       </CommandItem>
                     ))}
                   </CommandList>
                 </Command>
               </PopoverContent>
             </Popover>
   
             {/* Campo de CEP */}
             <div className="flex gap-2">
               <input
                 type="text"
                 placeholder="Digite o CEP ou ZIP"
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
                         price: frete.price,
                         name: frete.name,
                         delivery_time: frete.delivery_time,
                       })
                     }
                     className={cn(
                       "w-full text-left px-3 py-2 border rounded-lg text-sm",
                       freteSelecionado?.name === frete.name
                         ? "border-primary font-medium"
                         : "border-muted"
                     )}
                   >
                     {frete.name} - R$ {frete.price.toFixed(2)} ({frete.delivery_time} dias úteis)
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
   
           {/* Cupom */}
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
             {promoApplied && cupomValido && (
  <p className="text-xs text-emerald-600">
    {cupomValido.discountType === "percentage"
      ? `${cupomValido.discountValue}% de desconto aplicado!`
      : `Desconto de ${formatPrice(cupomValido.discountValue)} aplicado!`}
  </p>
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
             <div className="flex justify-between font-semibold pt-2 border-t mt-2">
               <span>Total</span>
               <span>{formatPrice(total)}</span>
             </div>
           </div>
   
           {/* Ações */}
           <div>
             <Button
  onClick={finalizarCompra}
  disabled={cart.items.length === 0 || !freteSelecionado}
  className="w-full py-3 rounded-lg bg-primary disabled:opacity-50 mb-2"
>
  Finalizar compra
</Button>
             <Link href="/products">
             <Button variant={"outline"} className="w-full py-3 rounded-lg border"> Continuar comprando </Button>
             </Link>
           </div>
         </aside>
       </div>
  );
}
