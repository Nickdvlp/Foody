"use server";

import { db } from "@/db";
import { cartItemsTable, foodItemsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

interface addToCartProps {
  itemId: string;
}
export const addToCart = async ({ itemId }: addToCartProps) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const item = (
      await db
        .select()
        .from(foodItemsTable)
        .where(eq(foodItemsTable.id, itemId))
    )[0];

    if (!item) throw new Error("Item not found");
    if (!item.isAvailable)
      throw new Error(`${item.name} is currently unavailable`);

    const existing = (
      await db
        .select()
        .from(cartItemsTable)
        .where(
          and(
            eq(cartItemsTable.userId, userId),
            eq(cartItemsTable.itemId, itemId)
          )
        )
    )[0];

    let cartItem;

    if (existing) {
      const updated = await db
        .update(cartItemsTable)
        .set({
          quantity: existing.quantity + 1,
          updatedAt: new Date(),
        })
        .where(eq(cartItemsTable.id, existing.id))
        .returning();
      cartItem = updated[0];
    } else {
      const inserted = await db
        .insert(cartItemsTable)
        .values({
          userId,
          itemId,
          quantity: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      cartItem = inserted[0];
    }

    return cartItem;
  } catch (error) {
    throw error;
  }
};
