"use client";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import React, { useRef } from "react";

const CarouselImages = [
  {
    link: "/image1.avif",
  },
  {
    link: "/image2.avif",
  },
  {
    link: "/image3.webp",
  },
  {
    link: "/image4.jpg",
  },
  {
    link: "/image5.jpg",
  },
];
const HomeCarousel = () => {
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  return (
    <div className="flex items-center justify-center w-full mx-auto">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[autoplay.current]}
        className="w-full max-w-screen overflow-hidden"
      >
        <CarouselContent>
          {CarouselImages.map((img, index) => (
            <CarouselItem key={index} className="basis-full ">
              <div className="p-2">
                <Card className="relative h-56 md:h-72 w-full overflow-hidden rounded-xl">
                  <Image
                    src={img.link}
                    alt="carousel-img"
                    fill
                    className="object-cover"
                    priority
                  />
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Controls */}
        <CarouselPrevious className="absolute top-1/2 left-4 -translate-y-1/2 opacity-60 hover:opacity-100" />
        <CarouselNext className="absolute top-1/2 right-4 -translate-y-1/2 opacity-60 hover:opacity-100" />
      </Carousel>
    </div>
  );
};

export default HomeCarousel;
