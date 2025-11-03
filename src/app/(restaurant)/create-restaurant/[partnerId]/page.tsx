import AddRestaurant from "@/modules/restaurant/components/add-restaurant";
import React from "react";

interface PageProps {
  params: Promise<{ partnerId: string }>;
}
const page = async ({ params }: PageProps) => {
  const { partnerId } = await params;

  return <AddRestaurant partnerId={partnerId} />;
};

export default page;
