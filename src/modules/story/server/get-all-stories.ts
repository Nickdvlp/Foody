"use server";

import { db } from "@/db";
import { restaurantTable, storyTable } from "@/db/schema";
import { eq, gt } from "drizzle-orm";

export const getAllStories = async () => {
  const stories = await db
    .select({
      storyId: storyTable.id,
      mediaUrl: storyTable.mediaUrl,
      mediaType: storyTable.mediaType,
      caption: storyTable.caption,
      createdAt: storyTable.createdAt,
      expiresAt: storyTable.expiresAt,

      restaurant: {
        id: restaurantTable.id,
        name: restaurantTable.name,
        imageUrl: restaurantTable.imageUrl,
        address: restaurantTable.address,
      },
    })
    .from(storyTable)
    .innerJoin(restaurantTable, eq(storyTable.restaurantId, restaurantTable.id))
    .where(gt(storyTable.expiresAt, new Date()))
    .orderBy(storyTable.createdAt);

  return stories;
};
