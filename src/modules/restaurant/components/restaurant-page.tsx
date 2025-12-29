"use client";

import React, { useEffect, useState } from "react";
import {
  getRestaurant,
  RestaurantWithFoodItems,
} from "../server/get-restaurant";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addCartItemAsync } from "@/store/cart/cartSlice";
import { AppDispatch } from "@/store";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface RestaurantPageProps {
  restaurantId: string;
}

const RestaurantPage = ({ restaurantId }: RestaurantPageProps) => {
  const [restaurant, setRestaurant] = useState<RestaurantWithFoodItems | null>(
    null
  );
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fetchRestaurant = async () => {
      const getRestaurantData = await getRestaurant({ restaurantId });
      setRestaurant(getRestaurantData);
    };
    fetchRestaurant();
  }, []);

  const addItemToCart = async (foodId: string) => {
    if (!isSignedIn) {
      toast.error("Please SignIn first to add items in cart.");
      return;
    }
    try {
      setIsLoading(true);
      await dispatch(addCartItemAsync(foodId)).unwrap();

      toast.success("item added to cart");
    } catch (error: unknown) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };
  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500 flex items-center justify-center gap-2">
          <span>
            <Loader2 className="animate-spin" />
          </span>
          Loading...
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO */}
      <div className="relative h-[55vh] w-full">
        <Image
          src={restaurant?.restaurant?.imageUrl || "/icon.png"}
          alt="restaurant"
          fill
          className="object-cover"
          priority
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Floating Glass Card */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-white shadow-xl">
            <h1 className="text-3xl md:text-4xl font-bold">
              {restaurant?.restaurant?.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-200">
              <span className="bg-green-600 px-3 py-1 rounded-full font-semibold">
                ⭐ 4.3
              </span>
              <span className="text-xl font-semibold">
                {restaurant?.restaurant.description}
              </span>
            </div>

            <p className="mt-3 text-gray-300 text-sm">
              {restaurant?.restaurant?.address}
            </p>
          </div>
        </div>
      </div>

      {/* STICKY MENU HEADER */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="font-bold text-lg">Menu</h2>
          <span className="text-sm text-gray-500">
            {restaurant?.foodItems?.length} items
          </span>
        </div>
      </div>

      {/* MENU LIST */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurant?.foodItems?.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-44 w-full">
                <Image
                  src={item.imageUrl || "/icon.png"}
                  alt={item.name}
                  fill
                  className="object-cover rounded-t-2xl"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col justify-between h-[180px]">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Delicious & freshly prepared
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold text-lg">₹{item.price}</span>

                  {isLoading ? (
                    <Button
                      disabled
                      className="bg-orange-600 hover:bg-orange-500 text-sm px-3 py-1.5"
                    >
                      <Loader2 className="animate-spin" size={16} />
                      Loading
                    </Button>
                  ) : (
                    <Button
                      className="bg-orange-600 hover:bg-orange-500 text-sm px-3 py-1.5"
                      onClick={() => addItemToCart(item.id)}
                    >
                      Add to cart
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;
