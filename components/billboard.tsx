"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Billboard, StoreProduct } from "@/app/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import ProductCard from "@/app/(store)/_components/ui/product-card";

interface BillboardCarouselProps {
  data: Billboard[];
  fistProducts: StoreProduct;
}

const BillboardCarousel: React.FC<BillboardCarouselProps> = ({ data, fistProducts }) => {
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
        <CarouselContent className="h-full w-full">
          {data.map((billboard, index) => (
            <CarouselItem
              key={billboard.id}
              className="w-screen h-screen flex flex-col md:flex-row items-center justify-center   gap-8 relative"
            >


              {/* Main Content */}
              <div className="flex flex-col justify-center items-center text-center w-screen">
                  <Image
                    src={billboard.imageUrl}
                    alt={billboard.imageUrl}
                    fill
                    className="object-cover"
                    priority
                  />
                <div className="hidden md:flex absolute top-[1/5] left-15 ">
                  <ProductCard product={fistProducts}/>
                </div>
                <div className="absolute bottom-0.5">
                <p className="text-lg mt-2">{`${current + 1}/${data.length}`}</p>

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
