"use server";

import { db } from "@/db";
import { ordersTable, orderItemsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, inArray } from "drizzle-orm";

export const updateOrdersIsSeen = async ({
  restaurantId,
}: {
  restaurantId: string;
}) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db
    .update(ordersTable)
    .set({
      isSeen: true,
    })
    .where(eq(ordersTable.restaurantId, restaurantId));
};
