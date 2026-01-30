import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB, { isConnectionError } from "@/lib/db";
import Enrollment from "@/models/Enrollment";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    if (!courseId) {
      return NextResponse.json(
        { error: "courseId query is required" },
        { status: 400 }
      );
    }
    await connectDB();
    const enrollment = await Enrollment.findOne({
      userId: session.user.id,
      courseId,
    });
    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled" }, { status: 404 });
    }
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
      { error: e instanceof Error ? e.message : "Failed to get progress" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { courseId, progress, completedLessons } = await request.json();
    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }
    if (typeof progress === "number" && (progress < 0 || progress > 100)) {
      return NextResponse.json(
        { error: "progress must be between 0 and 100" },
        { status: 400 }
      );
    }
    await connectDB();
    const enrollment = await Enrollment.findOneAndUpdate(
      { userId: session.user.id, courseId },
      {
        ...(typeof progress === "number" && { progress }),
        ...(Array.isArray(completedLessons) && { completedLessons }),
      },
      { new: true, runValidators: true }
    );
    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled" }, { status: 404 });
    }
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
      { error: e instanceof Error ? e.message : "Failed to update progress" },
      { status: 500 }
    );
  }
}
