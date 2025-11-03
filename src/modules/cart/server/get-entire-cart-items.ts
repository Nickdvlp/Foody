"use server";

import { db } from "@/db";
import { cartItemsTable, foodItemsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const getEntireCartItems = async () => {
  const { userId } = await auth();
  if (!userId) return [];

  const cartWithItems = await db
    .select({
      id: cartItemsTable.id,
      quantity: cartItemsTable.quantity,
      createdAt: cartItemsTable.createdAt,
      updatedAt: cartItemsTable.updatedAt,
      itemId: foodItemsTable.id,
      name: foodItemsTable.name,
      price: foodItemsTable.price,
      image: foodItemsTable.imageUrl,
      restaurantId: foodItemsTable.restaurantId,
    })
    .from(cartItemsTable)
    .leftJoin(foodItemsTable, eq(cartItemsTable.itemId, foodItemsTable.id))
    .where(eq(cartItemsTable.userId, userId));

  return cartWithItems;
};
