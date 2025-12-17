"use server";

import { db } from "@/db";
import {
  foodItemsTable,
  ratingsReviewsTable,
  restaurantTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export const getTopRatedItems = async () => {
  // Step 1: Get all ratings
  const ratings = await db.select().from(ratingsReviewsTable);

  // Step 2: Group by restaurantId and calculate average rating
  const grouped = ratings.reduce((acc, curr) => {
    if (!acc[curr.restaurantId]) {
      acc[curr.restaurantId] = { total: 0, count: 0 };
    }
    acc[curr.restaurantId].total += curr.rating;
    acc[curr.restaurantId].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  // Step 3: Calculate average ratings and sort
  const sorted = Object.entries(grouped)
    .map(([restaurantId, { total, count }]) => ({
      restaurantId,
      avgRating: total / count,
    }))
    .sort((a, b) => b.avgRating - a.avgRating);

  // Step 4 (Optional): Fetch restaurant details for top ones
  const topRestaurants = [];
  for (const item of sorted) {
    const [restaurant] = await db
      .select()
      .from(restaurantTable)
      .where(eq(restaurantTable.id, item.restaurantId));

    if (restaurant) {
      topRestaurants.push({
        ...restaurant,
        avgRating: item.avgRating.toFixed(1),
      });
    }
  }

  const foodItems = await db
    .select()
    .from(foodItemsTable)
    .where(eq(foodItemsTable.restaurantId, topRestaurants[0].id));

  return { topRestaurants, foodItems };
};
