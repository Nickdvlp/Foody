"use server";
import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

export function getRealtime() {
  if (!redis) {
    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      throw new Error("Upstash env variables are missing");
    }

    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  return redis;
}
