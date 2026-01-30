import { NextResponse } from "next/server";
import connectDB, { isConnectionError } from "@/lib/db";
import Course from "@/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const DB_UNAVAILABLE_MSG =
  "Database unavailable. Add your IP to MongoDB Atlas → Network Access.";

export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find().populate("instructor", "name email");
    return NextResponse.json(courses);
  } catch (e) {
    if (isConnectionError(e)) {
      return NextResponse.json({ error: DB_UNAVAILABLE_MSG }, { status: 503 });
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (session.user as { role?: string }).role;
    if (role !== "instructor" && role !== "admin") {
      return NextResponse.json({ error: "Instructor or admin only" }, { status: 403 });
    }
    const body = await request.json();
    await connectDB();
    const course = await Course.create({
      title: body.title,
      description: body.description,
      instructor: session.user.id,
      lessons: body.lessons ?? [],
    });
    return NextResponse.json(course);
  } catch (e) {
    if (isConnectionError(e)) {
      return NextResponse.json({ error: DB_UNAVAILABLE_MSG }, { status: 503 });
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create course" },
      { status: 500 }
    );
  }
}
