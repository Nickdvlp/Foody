"use server";

import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import {
  ordersTable,
  orderItemsTable,
  foodItemsTable,
  restaurantTable,
} from "@/db/schema";

export const getOrders = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Step 1: fetch orders of user
  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.userId, userId));

  // Step 2: for each order, include items + restaurant + food
  const ordersWithDetails = await Promise.all(
    orders.map(async (order) => {
      const items = await db
        .select({
          id: orderItemsTable.id,
          quantity: orderItemsTable.quantity,
          price: orderItemsTable.price,

          // food details
          food: {
            id: foodItemsTable.id,
            name: foodItemsTable.name,
            imageUrl: foodItemsTable.imageUrl,
            price: foodItemsTable.price,
          },

          // restaurant details
          restaurant: {
            id: restaurantTable.id,
            name: restaurantTable.name,
            imageUrl: restaurantTable.imageUrl,
            address: restaurantTable.address,
          },
        })
        .from(orderItemsTable)
        .leftJoin(foodItemsTable, eq(orderItemsTable.foodId, foodItemsTable.id))
        .leftJoin(
          restaurantTable,
          eq(orderItemsTable.restaurantId, restaurantTable.id)
        )
        .where(eq(orderItemsTable.orderId, order.id));

      return { ...order, items };
    })
  );

  return ordersWithDetails;
};
