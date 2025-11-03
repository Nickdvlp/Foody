"use server";

import { db } from "@/db";
import { cartItemsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

interface getCartItemsProps {
  userId: string;
}

export const getCartItems = async ({ userId }: getCartItemsProps) => {
  const cartItems = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.userId, userId));

  return cartItems;
};
