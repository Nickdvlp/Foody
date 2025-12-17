"use server";

import { EntireCartItems } from "@/app/(cart)/cart/page";
import { db } from "@/db";
import { cartItemsTable, foodItemsTable } from "@/db/schema";
import { redis } from "@/lib/redis";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const getEntireCartItems = async () => {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    // const cartItemCachedKey = "CartItem:all";

    // const cached = await redis.get(cartItemCachedKey);

    // if (cached) {
    //   return cached as EntireCartItems[];
    // }

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
  } catch (error) {
    throw new Error("Something went wrong");
  }
};
