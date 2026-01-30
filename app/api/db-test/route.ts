import { NextResponse } from "next/server";
import connectDB, { isConnectionError } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      ok: true,
      message: "Database connection successful",
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Connection failed";
    const status = isConnectionError(e) ? 503 : 500;
    return NextResponse.json(
      { ok: false, error: message },
      { status }
    );
  }
}
