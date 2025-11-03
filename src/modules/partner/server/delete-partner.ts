"use server";

import { db } from "@/db";
import { partnerTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

interface updatePartnerProps {
  partnerId: string | undefined;
}

export const deletePartner = async ({ partnerId }: updatePartnerProps) => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  if (!partnerId) {
    throw new Error("Invalid partnerId");
  }
  await db.delete(partnerTable).where(eq(partnerTable.id, partnerId));
};
