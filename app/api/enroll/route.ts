import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB, { isConnectionError } from "@/lib/db";
import Enrollment from "@/models/Enrollment";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { courseId } = await request.json();
    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }
    await connectDB();
    const existing = await Enrollment.findOne({
      userId: session.user.id,
      courseId,
    });
    if (existing) {
      return NextResponse.json(
        { error: "Already enrolled", enrollment: existing },
        { status: 409 }
      );
    }
    const enrollment = await Enrollment.create({
      userId: session.user.id,
      courseId,
    });
    return NextResponse.json(enrollment);
  } catch (e) {
    if (isConnectionError(e)) {
      return NextResponse.json(
        {
          error:
            "Database unavailable. Add your IP to MongoDB Atlas → Network Access.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Enrollment failed" },
      { status: 500 }
    );
  }
}
