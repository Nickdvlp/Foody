"use server";

import { db } from "@/db";
import { restaurantTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

interface DeleteRestaurantProps {
  restaurant: string | undefined;
}
export const deleteRestaurant = async ({
  restaurant,
}: DeleteRestaurantProps) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  await db.delete(restaurantTable).where(eq(restaurantTable.id, restaurant));
};
