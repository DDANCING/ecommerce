"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn, formatter } from "@/lib/utils";
import { StoreProduct } from "@/app/types";
import {
  fadeIn,
  fadeInUp,
  scaleIn,
  staggerContainer,
} from "@/lib/animations";

interface ProductClientProps {
  product: StoreProduct;
  suggestedProducts: StoreProduct[];
}

export default function ProductClient({
  product,
  suggestedProducts,
}: ProductClientProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ===== MOBILE ===== */}
      <motion.div {...fadeIn} className="block md:hidden">
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

        <motion.div {...fadeInUp} className="mt-6 space-y-4">
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
        </motion.div>
      </motion.div>

      {/* ===== TABLET / DESKTOP ===== */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-10 gap-x-8">
        {/* Miniaturas */}
        <motion.div {...staggerContainer} className="hidden lg:flex lg:flex-col lg:col-span-2 gap-y-4">
          {product.images.map((image) => (
            <motion.button
              key={image.id}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={cn(
                "relative h-48 w-48 overflow-hidden rounded-lg border",
                selectedImage.id === image.id ? "border-black" : "border-muted"
              )}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src={image.url}
                alt="Miniatura"
                fill
                className="object-cover"
                sizes="33vw"
              />
            </motion.button>
          ))}
        </motion.div>

        {/* Imagem Principal */}
        <motion.div {...scaleIn} className="relative w-full aspect-square lg:col-span-5">
          <Image
            src={selectedImage.url}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            sizes="50vw"
          />
        </motion.div>

        {/* Informações do Produto */}
        <motion.div {...fadeInUp} className="mt-6 md:mt-0 space-y-6 lg:col-span-3">
          <div>
            <Breadcrumb className="w-96">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/products">Catálogo</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/category/${product.category.id}`}>{product.category.name.length > 9 ? product.category.name.slice(0, 9) + "..." : product.category.name}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbPage>
                {product.name.length > 9 ? product.name.slice(0, 9) + "..." : product.name}
               </BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>
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

          <div className="grid 2xl:flex gap-2 ">
            <Button size="lg">ADICIONAR AO CARRINHO</Button>
            <Button variant="outline" size="lg">ENCONTRAR NA LOJA</Button>
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="overview-desktop">
              <AccordionTrigger>Visão Geral do Produto</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm leading-relaxed">{product.description}</p>
                <ul className="text-sm mt-3 space-y-1">
                  <li>SKU: {product.sku}</li>
                  <li>Tamanho: {product.size.name}</li>
                  <li className="flex gap-2 items-center">
                    Cor: {product.color.name}
                    <div
                      className="h-6 w-6 rounded-full border"
                      style={{ backgroundColor: product.color.value }}
                    />
                  </li>
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
        </motion.div>
      </div>

      {/* ===== SUGERIDOS ===== */}
      {suggestedProducts.length > 0 && (
        <motion.section {...fadeInUp} className="mt-16">
          <Separator className="mb-4" />
          <h2 className="text-xl font-semibold mb-4">Você também pode gostar</h2>

          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {suggestedProducts.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <Link href={`${item.id}`}>
                    <motion.div
                      {...fadeIn}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="space-y-2"
                    >
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
                    </motion.div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </motion.section>
      )}
    </div>
  );
}
