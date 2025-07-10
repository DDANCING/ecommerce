// components/BillboardCarousel.tsx

"use client";

import * as React from "react";
import Image from "next/image";
import { Billboard, StoreProduct } from "@/app/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ProductCard from "@/app/(store)/_components/ui/product-card";
import { motion } from "framer-motion";
import { slideInLeft } from "@/lib/animations";
import { Button } from "./ui/button";
import Link from "next/link";

interface BillboardCarouselProps {
  data: (Billboard & { highlightProduct?: (StoreProduct & { isInWishlist?: boolean }) | null })[];
}

const BillboardCarousel: React.FC<BillboardCarouselProps> = ({ data }) => {
  const [current, setCurrent] = React.useState(0);

  const handleSlideChange = (index: number) => {
    setCurrent(index);
  };

  return (
    <div className="max-w-screen max-h-screen bg-background text-foreground">
      <Carousel
        opts={{ align: "center", loop: true }}
        className="relative h-full w-full"
        setApi={(api) => {
          if (!api) return;
          api.on("select", () => {
            handleSlideChange(api.selectedScrollSnap());
          });
        }}
      >
        <CarouselContent className="h-full w-full gap-4 mt-20 mx-auto">
          {data.map((billboard, index) => (
            <CarouselItem
              key={billboard.id}
              className="w-screen h-screen flex flex-col md:flex-row items-center justify-center relative"
            >
              <div className="flex flex-col justify-center items-center text-center w-screen ">
                <Image
                  src={billboard.imageUrl}
                  alt={billboard.title}
                  fill
                  className="object-cover rounded-t-4xl"
                  priority
                />

                {billboard.highlightProduct && (
                  <motion.div
                    {...slideInLeft}
                    transition={{ delay: 0.5 }}
                    className="hidden md:flex absolute top-1/2 right-20 z-10"
                  >
                    <ProductCard
                    initialInWishlist={billboard.highlightProduct.isInWishlist}
                    size={0.7}
                    product={billboard.highlightProduct}
                  />
                  </motion.div>
                )}

                <div className="absolute top-4 z-20 px-3 py-1 mt-20">
                  <p className="font-bold text-4xl text-background/80"> {billboard.subtitle} </p>
                  <p className="text-1xl text-background/80"> {billboard.description} </p>
                  <Link href={"/products"}>
                  <Button variant={"secondary"} className="mt-4 rounded-full">
                    Descubra mais
                  </Button>
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default BillboardCarousel;
