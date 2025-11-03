"use server";

import { db } from "@/db";
import { partnerTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

interface getPartnerProps {
  partnerId: string;
}
export const getPartner = async ({ partnerId }: getPartnerProps) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [partner] = await db
    .select()
    .from(partnerTable)
    .where(eq(partnerTable.id, partnerId));

  if (!partner) {
    throw new Error("Partner not found");
  }
  return partner;
};
