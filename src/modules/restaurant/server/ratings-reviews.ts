"use server";

import { db } from "@/db";
import { ratingsReviewsTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

interface submitRatingsAndReviewsProps {
  rating: number;
  review: string;
  restaurantId: string | undefined;
  orderId: string | undefined;
}

export const submitRatingsAndReviews = async ({
  rating,
  review,
  restaurantId,
  orderId,
}: submitRatingsAndReviewsProps) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthorized");
  }

  if (!restaurantId || !orderId) {
    throw new Error("Restaurant Id or Order Id does not exist");
  }

  const existing = await db
    .select()
    .from(ratingsReviewsTable)
    .where(eq(ratingsReviewsTable.orderId, orderId));

  if (existing.length > 0) {
    return { success: false };
  }

  await db.insert(ratingsReviewsTable).values({
    userId,
    restaurantId,
    orderId,
    rating,
    review,
  });

  return { success: true };
};
