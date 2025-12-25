"use server";

import { db } from "@/db";
import { foodItemsTable, restaurantTable } from "@/db/schema";
import { redis } from "@/lib/redis";

import { eq } from "drizzle-orm";

const PAGE_SIZE = 4;
export const FetchFood = async (page: number = 1) => {
  const offset = (page - 1) * PAGE_SIZE;
  const foodCache = `foods:page:${page}`;

  const cached = await redis.get(foodCache);

  if (cached) {
    return cached;
  }

  const food = await db
    .select({
      id: foodItemsTable.id,
      name: foodItemsTable.name,
      description: foodItemsTable.description,
      price: foodItemsTable.price,
      preparationTime: foodItemsTable.preparationTime,
      imageUrl: foodItemsTable.imageUrl,
      category: foodItemsTable.category,
      rating: foodItemsTable.rating,
      isVeg: foodItemsTable.isVeg,
      isAvailable: foodItemsTable.isAvailable,
      restaurantId: foodItemsTable.restaurantId,
      restaurantName: restaurantTable.name,
    })
    .from(foodItemsTable)
    .leftJoin(
      restaurantTable,
      eq(foodItemsTable.restaurantId, restaurantTable.id)
    )
    .limit(PAGE_SIZE)
    .offset(offset);

  await redis.set(foodCache, food, { ex: 120 });
  return food;
};
