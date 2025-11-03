"use server";

import { db } from "@/db";
import { cartItemsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

interface removeCartItemProps {
  itemId: string;
}
const removeCartItem = async ({ itemId }: removeCartItemProps) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }
  const existing = await db
    .select()
    .from(cartItemsTable)
    .where(
      and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.itemId, itemId))
    );

  if (!existing[0]) {
    throw new Error("Item not found in your cart");
  }

  await db
    .delete(cartItemsTable)
    .where(
      and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.itemId, itemId))
    );

  return { success: true, message: "Item removed from cart" };
};

export default removeCartItem;
