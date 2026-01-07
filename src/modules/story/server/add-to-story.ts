"use server";

import { db } from "@/db";
import { storyTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

interface addToStoryProps {
  values: {
    restaurantId: string;
    caption: string;
    mediaType: "image" | "video";
    mediaUrl: string;
  };
}
export const addToStory = async ({ values }: addToStoryProps) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.insert(storyTable).values({
    restaurantId: values.restaurantId,
    caption: values.caption,
    mediaType: values.mediaType,
    mediaUrl: values.mediaUrl,
    expiresAt,
  });
  return { success: true, message: "Story added successfully." };
};
