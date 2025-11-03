"use server";

import { CartItem } from "@/modules/checkout/view/checkout-view";
import { db } from "@/db";
import {
  orderItemsTable,
  ordersTable,
  partnerTable,
  restaurantTable,
} from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { sendSMS } from "@/utils/sendSMS";
import { format } from "date-fns";
import { sendOrderEmail } from "@/utils/sendEmail";

interface createOrderProps {
  addressId: string;
  paymentMethod: string;
  items: CartItem[] | null;
  totalAmount: number | undefined;
  restaurantId: string;
}

export const createOrder = async ({
  addressId,
  paymentMethod,
  items,
  totalAmount,
  restaurantId,
}: createOrderProps) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (!items?.length) throw new Error("No items to order");
  if (typeof totalAmount !== "number") throw new Error("Invalid total amount");

  const [order] = await db
    .insert(ordersTable)
    .values({
      userId,
      addressId,
      totalAmount,
      orderStatus: "Placed",
      paymentMethod,
      paymentStatus: "Success",
      isSeen: false,
      createdAt: new Date(),
      restaurantId: restaurantId,
    })
    .returning({ id: ordersTable.id });

  const orderItems = items.map((item) => ({
    orderId: order.id,
    foodId: item.itemId!,
    restaurantId: item.restaurantId!,
    quantity: Number(item.quantity),
    price: item.price ? String(item.price) : "0.00",
  }));

  await db.insert(orderItemsTable).values(orderItems);

  const [restaurant] = await db
    .select({
      partnerId: restaurantTable.partnerId,
      restaurantName: restaurantTable.name,
    })
    .from(restaurantTable)
    .where(eq(restaurantTable.id, restaurantId));

  if (!restaurant) throw new Error("Restaurant not found");

  const [partner] = await db
    .select({
      mobileNumber: partnerTable.mobileNumber,
      ownerName: partnerTable.name,
      email: partnerTable.email,
    })
    .from(partnerTable)
    .where(eq(partnerTable.id, restaurant.partnerId));

  const partnerMobile = partner?.mobileNumber.trim();
  const partnerEmail = partner?.email;

  const formattedTime = format(new Date(), "dd MMM yyyy, h:mm a");

  const itemSummary = items
    .map((item) => `${item.name} x${item.quantity}`)
    .join(", ");

  // 📱 Construct the SMS text
  const message = `
🍴 New Order Received!
Restaurant: ${restaurant.restaurantName}
Order ID: ${order.id}
Items: ${itemSummary}
Total: ₹${totalAmount}
Payment: ${paymentMethod}
Placed At: ${formattedTime}
`.trim();

  await sendSMS({ partnerMobile, message });
  await sendOrderEmail({
    partnerEmail,
    orderId: order.id,
    restaurantName: restaurant.restaurantName,
    items,
    totalAmount,
    paymentMethod,
    formattedTime,
    itemSummary,
  });

  return { success: true, orderId: order.id };
};
