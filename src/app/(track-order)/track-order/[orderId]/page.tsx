import OrderTrackView from "@/modules/order/view/order-track-view";

interface PageProps {
  params: Promise<{
    orderId: string;
  }>;
}
const page = async ({ params }: PageProps) => {
  const { orderId } = await params;
  return <OrderTrackView orderId={orderId} />;
};

export default page;
