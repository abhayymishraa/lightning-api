import { Redis } from "@upstash/redis/cloudflare";
import next from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
  //-----------------------
  const start = performance.now();
  //-----------------------
  const request = await req.json();

  if (!request) return NextResponse.json({ message: "Invalid request" });
  if (!request.search)
    return NextResponse.json({ message: "Invalid search query" });

  const query = request.search.toUpperCase();
  const redis = new Redis({
    token: process.env.UPSTASH_REDIS_REST_TOEKN as string,
    url: process.env.UPSTASH_REDIS_REST_URL as string,
  });

  const res = [];
  const rank = await redis.zrank("terms", query);
  if (rank !== null && rank !== undefined) {
    const temp = await redis.zrange<string[]>("terms", rank, rank + 100);

    for (const el of temp) {
      if (!el.startsWith(query)) break;

      if (el.endsWith("*")) {
        res.push(el.substring(0, el.length - 1));
      }
    }
  }

  //-----------------------
  const end = performance.now();
  //-----------------------

  return NextResponse.json({ results: res, duration: end - start });
}catch(error){
    console.error(error);
    NextResponse.json({ results: [], message: "Internal server error" }, { status: 500 });  
}
}
