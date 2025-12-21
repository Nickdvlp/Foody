"use server";

import { db } from "@/db";
import { partnerTable } from "@/db/schema";
import { redis } from "@/lib/redis";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { Partner } from "../ui/view/partner-view";

interface getPartnerProps {
  partnerId: string;
}
export const getPartner = async ({ partnerId }: getPartnerProps) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const getPartnerCachedKey = `partner:${partnerId}`;

    const cached = await redis.get(getPartnerCachedKey);

    if (cached) {
      return cached as Partner;
    }

    const [partner] = await db
      .select()
      .from(partnerTable)
      .where(eq(partnerTable.id, partnerId));

    if (!partner) {
      throw new Error("Partner not found");
    }

    await redis.set(getPartnerCachedKey, partner, { ex: 120 });
    return partner;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
};
