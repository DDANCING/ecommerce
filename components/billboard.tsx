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

interface BillboardCarouselProps {
  data: (Billboard & { highlightProduct?: StoreProduct | null })[];
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
                    className="hidden md:flex absolute top-1/4 left-20 z-10"
                  >
                    <ProductCard product={billboard.highlightProduct} />
                  </motion.div>
                )}

                <div className="absolute bottom-2 z-20 bg-background/80 px-3 py-1 rounded">
                  <p className="text-md mt-2">{`${current + 1}/${data.length}`}</p>
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
