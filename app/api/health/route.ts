import { db } from "@/lib/db";
import { error, json, withCors } from "@/lib/api";
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return withCors(
      json({
        status: "ok",
        database: "connected",
        timestamp: new Date().toISOString(),
      }),
    );
  } catch {
    return withCors(error("Database unavailable", 503));
  }
}
export async function OPTIONS() {
  return withCors(new Response(null, { status: 204 }));
}
