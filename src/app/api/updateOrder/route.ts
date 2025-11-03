import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: Request) {
  const { orderId, status } = await req.json();

  // Update your DB here (for example, Drizzle or Prisma)
  // await db.update(ordersTable).set({ status }).where(eq(ordersTable.id, orderId));

  // Publish to Upstash channel
  await redis.publish("order-updates", JSON.stringify({ orderId, status }));

  return NextResponse.json({ success: true });
}
