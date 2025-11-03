"use server";

import { db } from "@/db";
import { ordersTable, orderStatusEnum } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

type OrderStatus = (typeof orderStatusEnum.enumValues)[number];

interface updateOrderStatusProps {
  newStatus: OrderStatus;
  orderId: string;
}
export const updateOrderStatus = async ({
  newStatus,
  orderId,
}: updateOrderStatusProps) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db
    .update(ordersTable)
    .set({
      orderStatus: newStatus,
    })
    .where(eq(ordersTable.id, orderId));
};
