"use server";

import { db } from "@/db";
import { partnerTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

interface updatePartnerProps {
  values: {
    name: string;
    address: string;
    imageUrl: string;
  };
  partnerId: string;
}

export const updatePartner = async ({
  partnerId,
  values,
}: updatePartnerProps) => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  const [partner] = await db
    .update(partnerTable)
    .set({
      name: values.name,
      imageUrl: values.imageUrl,
      address: values.address,
      updatedAt: new Date(),
    })
    .where(
      and(eq(partnerTable.id, partnerId), eq(partnerTable.userId, clerkId))
    )
    .returning();

  return partner;
};
