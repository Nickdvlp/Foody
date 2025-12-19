"use server";

import { db } from "@/db";
import { restaurantTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

interface UpdateRestaurantProps {
  values: {
    name: string;
    imageUrl: string;
    address: string;
    description: string;
  };
}
export const updateRestaurant = async ({ values }: UpdateRestaurantProps) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db.update(restaurantTable).set({
    name: values.name,
    imageUrl: values.imageUrl,
    description: values.description,
    address: values.address,
  });

  return { success: true, message: "Restaurant Updated" };
};
