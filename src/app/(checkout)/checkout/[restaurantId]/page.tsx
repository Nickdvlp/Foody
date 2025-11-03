import CheckoutPage from "@/modules/checkout/view/checkout-view";
import React from "react";

interface PageProps {
  params: Promise<{
    restaurantId: string;
  }>;
}
const page = async ({ params }: PageProps) => {
  const { restaurantId } = await params;
  return (
    <div>
      <CheckoutPage restaurantId={restaurantId} />
    </div>
  );
};

export default page;
