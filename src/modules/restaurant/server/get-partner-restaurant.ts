"use server";
import { db } from "@/db";
import { restaurantTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

interface getPartnerRestaurantProps {
  restaurantId: string;
}

export const getPartnerRestaurant = async ({
  restaurantId,
}: getPartnerRestaurantProps) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [restaurant] = await db
    .select()
    .from(restaurantTable)
    .where(eq(restaurantTable.id, restaurantId));

  return restaurant;
};
