import { realtime } from "@/lib/realtime";
import { updateOrderStatus } from "@/modules/order/server/update-order-status";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { orderId, newStatus } = body;

  await updateOrderStatus({ orderId, newStatus });

  await realtime.emit("order.status", newStatus);

  return new Response("OK");
};
