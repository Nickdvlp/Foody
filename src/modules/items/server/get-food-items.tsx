"use server";

import { db } from "@/db";
import { foodItemsTable, usersTable } from "@/db/schema";
import { redis } from "@/lib/redis";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

interface GetFoodItemsProps {
  restaurantId: string | undefined;
}

export const getFoodItems = async ({ restaurantId }: GetFoodItemsProps) => {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkId, clerkId));
  if (!user) throw new Error("User not found");

  if (!restaurantId) throw new Error("Restaurant ID is required");

  const foodItems = await db
    .select()
    .from(foodItemsTable)
    .where(eq(foodItemsTable.restaurantId, restaurantId));

  return foodItems;
};
