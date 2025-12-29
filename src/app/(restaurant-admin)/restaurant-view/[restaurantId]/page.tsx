import RestaurantView from "@/modules/restaurant/views/restaurant-view";

import React from "react";

interface PageProps {
  params: Promise<{ restaurantId: string }>;
}
const Page = async ({ params }: PageProps) => {
  const { restaurantId } = await params;

  return (
    <div>
      <RestaurantView restaurantId={restaurantId} />
    </div>
  );
};

export default Page;
