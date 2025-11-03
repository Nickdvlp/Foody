"use server";

import { db } from "@/db";
import { cartItemsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

interface updateCartItemProps {
  itemId: string;
  quantity: number;
}

const updateCartItem = async ({ itemId, quantity }: updateCartItemProps) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Find existing cart item for this user
  const existing = await db
    .select()
    .from(cartItemsTable)
    .where(
      and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.itemId, itemId))
    );

  const cartItem = existing[0];
  if (!cartItem) {
    throw new Error("Item not found in your cart");
  }

  // Prevent negative or zero quantity
  if (quantity <= 0) {
    await db
      .delete(cartItemsTable)
      .where(
        and(
          eq(cartItemsTable.userId, userId),
          eq(cartItemsTable.itemId, itemId)
        )
      );

    return { success: true, message: "Item removed from cart" };
  }

  // Update the quantity
  await db
    .update(cartItemsTable)
    .set({ quantity, updatedAt: new Date() })
    .where(
      and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.itemId, itemId))
    );

  return { success: true, message: "Cart updated successfully" };
};

export default updateCartItem;
