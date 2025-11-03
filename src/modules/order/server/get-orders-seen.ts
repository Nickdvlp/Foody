"use server";

import { db } from "@/db";
import { ordersTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export const getOrdersSeen = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const orders = await db.select().from(ordersTable);

  return orders;
};
