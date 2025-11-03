"use server";

import { db } from "@/db";
import { partnerTable, usersTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

interface createPartnerProps {
  values: {
    name: string;
    address: string;
    imageUrl: string;
    mobileNumber: string;
    email: string;
  };
}
export const createPartner = async ({ values }: createPartnerProps) => {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkId, clerkId));

  if (!user) {
    throw new Error("User not found");
  }

  const [partner] = await db
    .insert(partnerTable)
    .values({
      name: values.name,
      imageUrl: values.imageUrl,
      userId: user.clerkId,
      mobileNumber: values.mobileNumber,
      email: values.email,
      address: values.address,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return partner;
};
