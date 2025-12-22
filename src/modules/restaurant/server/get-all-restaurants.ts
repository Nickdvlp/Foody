"use server";

import { db } from "@/db";
import { restaurantTable } from "@/db/schema";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { Restaurants } from "../components/restaurants-card";
import { redis } from "@/lib/redis";

interface getAllRestaurantsProps {
  partnerId: string;
}
export const getAllRestaurants = async ({
  partnerId,
}: getAllRestaurantsProps) => {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      throw new Error("Unauthorized");
    }

    const getRestaurantsCachedKey = `restaurants:${partnerId}`;

    const cached = await redis.get(getRestaurantsCachedKey);

    if (cached) {
      return cached as Restaurants[];
    }
    const restaurants = await db
      .select()
      .from(restaurantTable)
      .where(eq(restaurantTable.partnerId, partnerId));

    await redis.set(getRestaurantsCachedKey, restaurants, { ex: 120 });
    return restaurants;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
};
