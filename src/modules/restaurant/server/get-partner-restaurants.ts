"use server";

import { db } from "@/db";
import { partnerTable, restaurantTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const getPartnerRestaurants = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [partner] = await db
    .select()
    .from(partnerTable)
    .where(eq(partnerTable.userId, userId));

  if (!partner) {
    throw new Error("Unauthorized");
  }
  const restaurants = await db
    .select()
    .from(restaurantTable)
    .where(eq(restaurantTable.partnerId, partner.id));

  return restaurants;
};
