"use server";

import { db } from "@/db";
import { addressesTable, ordersTable, restaurantTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const getTrackingAddresses = async ({
  orderId,
}: {
  orderId: string;
}) => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, orderId));

  const [userAddress] = await db
    .select()
    .from(addressesTable)
    .where(eq(addressesTable.id, order.addressId));

  const [restaurantAddress] = await db
    .select()
    .from(restaurantTable)
    .where(eq(restaurantTable.id, order.restaurantId));

  return { userAddress, restaurantAddress };
};
