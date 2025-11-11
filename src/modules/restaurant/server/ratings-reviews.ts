"use server";

import { db } from "@/db";
import {
  partnerTable,
  ratingsReviewsTable,
  restaurantTable,
} from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

interface submitRatingsAndReviewsProps {
  rating: number;
  review: string;
  restaurantId: string;
  orderId: string;
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
