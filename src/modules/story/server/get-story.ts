"use server";

import { db } from "@/db";
import { restaurantTable, storyTable } from "@/db/schema";
import { eq } from "drizzle-orm";

interface getStoryProps {
  storyId: string;
}
export const getStory = async ({ storyId }: getStoryProps) => {
  const story = await db
    .select()
    .from(storyTable)
    .innerJoin(restaurantTable, eq(restaurantTable.id, storyTable.restaurantId))
    .where(eq(storyTable.id, storyId));

  return story;
};
