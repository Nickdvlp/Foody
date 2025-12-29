import RestaurantPage from "@/modules/restaurant/components/restaurant-page";
import React from "react";

interface RestaurantPageProps {
  params: Promise<{
    restaurantId: string;
  }>;
}
const page = async ({ params }: RestaurantPageProps) => {
  const { restaurantId } = await params;

  return <RestaurantPage restaurantId={restaurantId} />;
};

export default page;
