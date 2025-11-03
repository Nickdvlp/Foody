"use server";

import { db } from "@/db";
import {
  orderItemsTable,
  ordersTable,
  usersTable,
  addressesTable,
  foodItemsTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

interface GetOrdersByRestaurantProps {
  restaurantId: string;
}

export const getOrdersByRestaurant = async ({
  restaurantId,
}: GetOrdersByRestaurantProps) => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const orders = await db
    .select({
      orderId: ordersTable.id,
      totalAmount: ordersTable.totalAmount,
      orderStatus: ordersTable.orderStatus,
      paymentMethod: ordersTable.paymentMethod,
      paymentStatus: ordersTable.paymentStatus,
      createdAt: ordersTable.createdAt,
      isSeen: ordersTable.isSeen,

      userName: usersTable.name,
      userImage: usersTable.imageUrl,

      addressFullName: addressesTable.fullName,
      addressPhone: addressesTable.phone,
      addressStreet: addressesTable.street,
      addressCity: addressesTable.city,
      addressState: addressesTable.state,

      foodName: foodItemsTable.name,
      foodImage: foodItemsTable.imageUrl,
      quantity: orderItemsTable.quantity,
      price: orderItemsTable.price,
    })
    .from(orderItemsTable)
    .innerJoin(ordersTable, eq(orderItemsTable.orderId, ordersTable.id))
    .innerJoin(usersTable, eq(ordersTable.userId, usersTable.clerkId))
    .innerJoin(addressesTable, eq(ordersTable.addressId, addressesTable.id))
    .innerJoin(foodItemsTable, eq(orderItemsTable.foodId, foodItemsTable.id))
    .where(eq(orderItemsTable.restaurantId, restaurantId))
    .orderBy(ordersTable.createdAt);

  return orders;
};
