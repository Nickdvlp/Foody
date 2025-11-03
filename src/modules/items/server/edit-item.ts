"use server";

import { db } from "@/db";
import { foodItemsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

interface EditItemProps {
  id: string;
}

export const EditItem = async ({ id }: EditItemProps) => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  await db.delete(foodItemsTable).where(eq(foodItemsTable.id, id));

  const updatedFoods = await db.select().from(foodItemsTable);
  return updatedFoods;
};
