"use server";

import { db } from "@/db";
import { foodItemsTable } from "@/db/schema";

export const getCategories = async () => {
  const category = await db
    .select({ categories: foodItemsTable.category })
    .from(foodItemsTable);
  return category;
};
