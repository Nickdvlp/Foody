import OrderStatusUpdate from "@/modals/order-status-update";

interface OrderStatusUpdateProps {
  params: Promise<{
    restaurantId: string;
  }>;
}

// interface Order {
//   id: string;
//   orderId: string;
//   foodId: string;
//   restaurantId: string;
//   quantity: number;
//   price: string;
// }

// const orderStatusOptions = [
//   "Placed",
//   "Confirmed",
//   "Preparing",
//   "Ready for Pickup",
//   "Out for Delivery",
//   "Delivered",
//   "Cancelled",
// ] as const;

const Page = async ({ params }: OrderStatusUpdateProps) => {
  const { restaurantId } = await params;

  return (
    <div>
      <OrderStatusUpdate restaurantId={restaurantId} />
    </div>
  );
};

export default Page;
