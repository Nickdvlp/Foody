"use server";

import { db } from "@/db";
import { addressesTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export const getAllAddresses = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const addresses = await db
    .select()
    .from(addressesTable)
    .where(eq(addressesTable.userId, userId));

  return addresses;
};
