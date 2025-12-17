"use server";

import { db } from "@/db";
import { partnerTable } from "@/db/schema";
import { redis } from "@/lib/redis";
import { Partner } from "@/modules/partner/ui/view/partner-view";
import { eq } from "drizzle-orm";

export async function fetchPartner(userId: string) {
  try {
    const partnerCachedKey = `Partner:${userId}`;
    const cached = await redis.get(partnerCachedKey);

    if (cached) {
      return cached as Partner;
    }
    const data = await db
      .select()
      .from(partnerTable)
      .where(eq(partnerTable.userId, userId));

    await redis.set(partnerCachedKey, data[0], { ex: 120 });
    return data[0] || null;
  } catch (error) {
    throw new Error("Something went wrong");
  }
}
