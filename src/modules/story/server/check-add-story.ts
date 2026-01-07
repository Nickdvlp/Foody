"use server";

import { db } from "@/db";
import { partnerTable, restaurantTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const checkAddStory = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [partner] = await db
    .select()
    .from(partnerTable)
    .where(eq(partnerTable.userId, userId));

  const [restaurants] = await db
    .select()
    .from(restaurantTable)
    .where(eq(restaurantTable.partnerId, partner.id));
  if (restaurants) {
    return true;
  } else {
    return false;
  }
};
