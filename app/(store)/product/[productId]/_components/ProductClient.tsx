"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn, formatter } from "@/lib/utils";
import { StoreProduct } from "@/app/types";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface ProductClientProps {
  product: StoreProduct;
  suggestedProducts: StoreProduct[];
}

export default function ProductClient({
  product,
  suggestedProducts,
}: ProductClientProps) {
  const [selectedImage, setSelectedImage] = useState<{
    id: string;
    url: string;
  }>(product.images[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ===== MOBILE ===== */}
      <div className="block md:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            {product.images.map((image) => (
              <CarouselItem key={image.id} className="basis-full">
                <div className="relative w-full aspect-square">
                  <Image
                    src={image.url}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                    sizes="100vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div className="mt-6 space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold">
            {formatter.format(Number(product.price))}
          </p>

          <div className="grid grid-cols-1 md:flex gap-2">
            <Button size="lg" className="flex-1">
              ADICIONAR AO CARRINHO
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              ENCONTRAR NA LOJA
            </Button>
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="overview">
              <AccordionTrigger>Visão Geral do Produto</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm leading-relaxed">{product.description}</p>
                <ul className="text-sm mt-3 space-y-1">
                  <li> {product.sku} </li>
                  <li>Cuidados: Lavar à mão</li>
                  <li>Composição: 100% Algodão</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="policy">
              <AccordionTrigger>
                Política de Entrega, Devolução e Troca
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm leading-relaxed">
                  Entrega gratuita em até 7 dias úteis. Trocas e devoluções em
                  até 30 dias corridos após o recebimento.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* ===== TABLET / DESKTOP ===== */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-10 gap-x-8">
        {/* Miniaturas */}
       <div className="hidden lg:flex lg:flex-col lg:col-span-2 gap-y-4">
  {product.images.map((image) => (
    <button
      key={image.id}
      type="button"
      onClick={() => setSelectedImage(image)}
      className={cn(
        "relative h-48 w-48 overflow-hidden rounded-lg border",
        selectedImage.id === image.id ? "border-black" : "border-muted"
      )}
    >
      <Image
        src={image.url}
        alt="Miniatura"
        fill
        className="object-cover"
        sizes="33vw"
      />
            </button>
          ))}
        </div>

        {/* Imagem Principal */}
        <div className="relative w-full aspect-square lg:col-span-5">
          <Image
            src={selectedImage.url}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            sizes="50vw"
          />
        </div>

        {/* Informações do Produto */}
        <div className="mt-6 md:mt-0 space-y-6 lg:col-span-3">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
           <div className="flex items-center gap-2">
             <p className="text-2xl font-semibold mt-2">
              {formatter.format(Number(product.price))}
            </p>
            {product.originalPrice && (
              <p className="text-lg font-semibold mt-2 text-muted-foreground line-through">
              {formatter.format(Number(product.originalPrice))}
            </p>
            )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button size="lg" className="flex-1">
              ADICIONAR AO CARRINHO
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              ENCONTRAR NA LOJA
            </Button>
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="overview-desktop">
              <AccordionTrigger>Visão Geral do Produto</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm leading-relaxed">{product.description}</p>
                <ul className="text-sm mt-3 space-y-1">
                  <li>SKU: {product.sku}</li>
                  <li>Tamaho: {product.size.name}</li>
                  <li className="flex gap-2 items-center">Cor: {product.color.name} <div 
             className="h-6 w-6 rounded-full border" 
            style={{backgroundColor: product.color.value}}
             /></li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="policy-desktop">
              <AccordionTrigger>
                Política de Entrega, Devolução e Troca
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm leading-relaxed">
                  Entrega gratuita em até 7 dias úteis. Trocas e devoluções em
                  até 30 dias corridos após o recebimento.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
     
      {/* ===== SUGERIDOS ===== */}
      {suggestedProducts.length > 0 && (
        <section className="mt-16">
           <Separator className="mb-4"/>
          <h2 className="text-xl font-semibold mb-4">Você também pode gostar</h2>

          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {suggestedProducts.map((item) => (
                <Link key={item.id} href={`${item.id}`} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                <CarouselItem
                  
                >
                  <div className="space-y-2">
                    <div className="relative w-full aspect-square overflow-hidden rounded-lg border">
                      <Image
                        src={item.images[0].url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="25vw"
                      />
                    </div>
                    <p className="text-center text-sm">{item.name}</p>
                  </div>
                </CarouselItem>
                </Link>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      )}
    </div>
  );
}
