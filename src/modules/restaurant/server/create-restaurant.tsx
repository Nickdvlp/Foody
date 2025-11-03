"use server";

import { db } from "@/db";
import { partnerTable, restaurantTable, usersTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

interface createPartnerProps {
  values: {
    name: string;
    address: string;
    imageUrl: string;
    description: string;
  };
  partnerId: string;
}
export const createRestaurant = async ({
  values,
  partnerId,
}: createPartnerProps) => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkId, clerkId));

  if (!user) {
    throw new Error("User not found");
  }

  const [restaurant] = await db
    .insert(restaurantTable)
    .values({
      partnerId,
      name: values.name,
      imageUrl: values.imageUrl,
      address: values.address,
      description: values.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return restaurant.id;
};
