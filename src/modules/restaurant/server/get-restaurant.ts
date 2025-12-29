"use server";

import { db } from "@/db";
import { foodItemsTable, restaurantTable, usersTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, InferSelectModel } from "drizzle-orm";

export type Restaurant = InferSelectModel<typeof restaurantTable>;
export type FoodItem = InferSelectModel<typeof foodItemsTable>;

export type RestaurantWithFoodItems = {
  restaurant: Restaurant;
  foodItems: FoodItem[];
};

interface getRestaurantProps {
  restaurantId: string;
}

export const getRestaurant = async ({
  restaurantId,
}: getRestaurantProps): Promise<RestaurantWithFoodItems | null> => {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) throw new Error("Unauthorized");

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkId, clerkId));

    if (!user) throw new Error("User not found");
    if (!restaurantId) throw new Error("Restaurant not found");

    const rows = await db
      .select({
        restaurant: restaurantTable,
        foodItem: foodItemsTable,
      })
      .from(restaurantTable)
      .leftJoin(
        foodItemsTable,
        eq(foodItemsTable.restaurantId, restaurantTable.id)
      )
      .where(eq(restaurantTable.id, restaurantId));

    if (rows.length === 0) return null;

    const restaurant = rows[0].restaurant;

    // Narrow foodItems type
    const foodItems: FoodItem[] = rows
      .map((r) => r.foodItem)
      .filter((item): item is FoodItem => item !== null);

    return {
      restaurant,
      foodItems,
    };
  } catch (error) {
    console.error(error);
    return null; // Important: return null instead of undefined
  }
};
