"use server";

import { db } from "@/db";
import { addressesTable } from "@/db/schema";

import { auth } from "@clerk/nextjs/server";

interface setAddressProps {
  values: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export const setAddress = async ({ values }: setAddressProps) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  await db
    .insert(addressesTable)
    .values({
      userId,
      fullName: values.fullName,
      phone: values.phone,
      street: values.street,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      lat: 0,
      long: 0,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return { success: true, message: "Address added successfully." };
};
