"use server";

import { db } from "@/db";
import { cartItemsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const clearCartItems = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));
};
