"use server";

import { db } from "@/db";
import { ordersTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const cancelOrder = async (id: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.delete(ordersTable).where(eq(ordersTable.id, id));
};
