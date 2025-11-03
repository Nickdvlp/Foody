"use server";

import { db } from "@/db";
import { restaurantTable, usersTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

interface getRestaurantProps {
  restaurantId: string;
}

export const getRestaurant = async ({ restaurantId }: getRestaurantProps) => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkId, clerkId));

  if (!user) {
    throw new Error("User not found");
  }
  const [restaurant] = await db
    .select()
    .from(restaurantTable)
    .where(eq(restaurantTable.id, restaurantId));

  return restaurant;
};
