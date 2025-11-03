"use server";

import { db } from "@/db";
import { restaurantTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

interface getAllRestaurantsProps {
  partnerId: string;
}
export const getAllRestaurants = async ({
  partnerId,
}: getAllRestaurantsProps) => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  const restaurants = await db
    .select()
    .from(restaurantTable)
    .where(eq(restaurantTable.partnerId, partnerId));

  return restaurants;
};
