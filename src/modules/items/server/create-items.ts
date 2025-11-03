"use server";

import { db } from "@/db";
import { foodItemsTable, usersTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

interface createItemsProps {
  values: {
    name: string;
    imageUrl: string;
    description: string;
    price: string;
    preparationTime: string;
    isAvailable: boolean;
    ingredients: string;
    category: string;
  };
  restaurantId: string;
}
export const createItems = async ({
  values,
  restaurantId,
}: createItemsProps) => {
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

  const splittedIngredients = values.ingredients
    .split(",")
    .map((val) => val.trim());

  await db.insert(foodItemsTable).values({
    restaurantId,
    imageUrl: values.imageUrl,
    name: values.name,
    description: values.description,
    price: Number(values.price),
    preparationTime: Number(values.preparationTime),
    ingredients: splittedIngredients,
    category: values.category,
    isAvailable: true,
  });
  console.log("item added to db");
};
