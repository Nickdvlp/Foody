"use server";

import { db } from "@/db";
import { foodItemsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

interface updateItemProps {
  imageUrl: string;
  name: string;
  description: string;
  price: string;
  preparationTime: string;
  ingredients: string;
  isAvailable: boolean;
}
export async function updateItem(id: string, values: updateItemProps) {
  await db
    .update(foodItemsTable)
    .set({
      name: values.name,
      description: values.description,
      price: values.price,
      preparationTime: parseInt(values.preparationTime),
      ingredients: values.ingredients.split(",").map((i: string) => i.trim()),
      imageUrl: values.imageUrl,
      isAvailable: values.isAvailable,
      updatedAt: new Date(),
    })
    .where(eq(foodItemsTable.id, id));
}
