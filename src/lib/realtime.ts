import { Realtime, InferRealtimeEvents } from "@upstash/realtime";

import z from "zod";
import { getRealtime } from "./redis";

const schema = {
  order: {
    status: z.string(),
  },
};
const redis = getRealtime();

export const realtime = new Realtime({ schema, redis });
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>;
