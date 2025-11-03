"use server";

import { db } from "@/db";
import { partnerTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchPartner(userId: string) {
  const data = await db
    .select()
    .from(partnerTable)
    .where(eq(partnerTable.userId, userId));
  return data[0] || null;
}
