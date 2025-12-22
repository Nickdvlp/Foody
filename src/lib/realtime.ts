import { Realtime, InferRealtimeEvents } from "@upstash/realtime";
import { redis } from "./redis";
import z from "zod";

const schema = {
  order: {
    status: z.string(),
  },
};

export const realtime = new Realtime({ schema, redis });
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>;
