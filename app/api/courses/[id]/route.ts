import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB, { isConnectionError } from "@/lib/db";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const course = await Course.findById(id)
      .populate("instructor", "name email")
      .lean();
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json(course);
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
      { error: e instanceof Error ? e.message : "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (session.user as { role?: string }).role;
    if (role !== "instructor" && role !== "admin") {
      return NextResponse.json(
        { error: "Instructor or admin only" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    await connectDB();

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    if (course.instructor?.toString() !== session.user.id && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (body.title !== undefined) course.title = body.title;
    if (body.description !== undefined) course.description = body.description;
    if (Array.isArray(body.lessons)) course.lessons = body.lessons;
    if (body.lesson !== undefined) {
      const { title, videoUrl } = body.lesson;
      course.lessons.push({ title: title ?? "Lesson", videoUrl: videoUrl ?? "" });
    }
    await course.save();

    return NextResponse.json(course);
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
      { error: e instanceof Error ? e.message : "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (session.user as { role?: string }).role;
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Admin only" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await connectDB();

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    await Enrollment.deleteMany({ courseId: id });

    return NextResponse.json({ message: "Course deleted" });
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
      { error: e instanceof Error ? e.message : "Failed to delete course" },
      { status: 500 }
    );
  }
}
