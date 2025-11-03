"use client";

import React, { useEffect, useState } from "react";
import { getAllRestaurants } from "../server/get-all-restaurants";
import { Loader2, MapPin } from "lucide-react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

interface RestaurantsCardProps {
  partnerId: string;
}

export interface Restaurants {
  id: string;
  partnerId: string;
  name: string;
  imageUrl: string | null;
  description: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantsCard = ({ partnerId }: RestaurantsCardProps) => {
  const [restaurants, setRestaurants] = useState<Restaurants[] | null>(null);

  useEffect(() => {
    const fetchAllRestaurants = async () => {
      const data = await getAllRestaurants({ partnerId });
      setRestaurants(data);
    };
    fetchAllRestaurants();
  }, [partnerId]);

  // ✅ Loading State
  if (restaurants === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-orange-600 size-10" />
      </div>
    );
  }

  // ✅ Empty State
  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Create Your First Restaurant 🍽️
        </h2>
        <p className="text-gray-600 mb-5 max-w-md">
          You haven't added any restaurants yet. Start by creating one to add
          your delicious dishes!
        </p>
        <Button
          onClick={() => redirect(`/create-restaurant/${partnerId}`)}
          className="bg-orange-600 hover:bg-orange-500 text-white"
        >
          Add Restaurant
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 min-h-screen">
      <div className="flex flex-col gap-5 max-w-5xl mx-auto">
        {restaurants.map((item) => (
          <div
            key={item.id}
            className="backdrop-blur-md bg-white/50 border border-white/30 shadow-lg rounded-3xl flex items-center gap-5 p-4 hover:bg-white/70 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            onClick={() => redirect(`/restaurant-view/${item.id}`)}
          >
            <div className="relative h-28 w-28 flex-shrink-0 rounded-2xl overflow-hidden shadow-md">
              <Image
                src={
                  item.imageUrl ||
                  "https://via.placeholder.com/400x300?text=No+Image"
                }
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {item.description
                  ? item.description.length >= 100
                    ? `${item.description.slice(0, 100)}...`
                    : item.description
                  : ""}
              </p>

              {item.address && (
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="size-4 mr-1" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="truncate max-w-[250px]">
                        {item.address}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{item.address}</TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantsCard;
