import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

/**
 * 🔑 IMPORTANT:
 * Prevent Next.js from executing this route during build
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created") {
      const user = evt.data;

      await db.insert(usersTable).values({
        clerkId: user.id,
        name: `${user.first_name ?? ""} ${user.last_name ?? ""}`,
        imageUrl: user.image_url ?? "",
      });
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
