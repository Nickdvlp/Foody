"use server";

import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { addressesTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function setDefaultAddress(addressId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }
  try {
    await db
      .update(addressesTable)
      .set({ isDefault: false })
      .where(eq(addressesTable.userId, userId));

    await db
      .update(addressesTable)
      .set({ isDefault: true })
      .where(
        and(eq(addressesTable.userId, userId), eq(addressesTable.id, addressId))
      );

    return { success: true, message: "Default address updated successfully" };
  } catch (error) {
    console.error("Error updating default address:", error);
    return { success: false, message: "Failed to update default address" };
  }
}
