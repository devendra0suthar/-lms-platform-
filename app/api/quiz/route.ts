import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB, { isConnectionError } from "@/lib/db";
import Quiz from "@/models/Quiz";
import QuizAttempt from "@/models/QuizAttempt";

const DB_ERROR = "Database unavailable. Please try again later.";

// GET - Fetch quiz for a course
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    await connectDB();
    const quiz = await Quiz.findOne({ courseId }).lean();

    if (!quiz) {
      return NextResponse.json({ quiz: null });
    }

    // Don't send correct answers to client
    const safeQuiz = {
      ...quiz,
      _id: String(quiz._id),
      courseId: String(quiz.courseId),
      questions: quiz.questions.map((q: { question: string; options: string[]; _id?: unknown }) => ({
        _id: String(q._id),
        question: q.question,
        options: q.options,
      })),
    };

    return NextResponse.json({ quiz: safeQuiz });
  } catch (e) {
    if (isConnectionError(e)) {
      return NextResponse.json({ error: DB_ERROR }, { status: 503 });
    }
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}

// POST - Create quiz (instructors only)
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

    const { courseId, title, description, questions, passingScore } = await request.json();

    if (!courseId || !title || !questions?.length) {
      return NextResponse.json({ error: "courseId, title, and questions are required" }, { status: 400 });
    }

    await connectDB();

    // Check if quiz already exists for this course
    const existing = await Quiz.findOne({ courseId });
    if (existing) {
      // Update existing quiz
      existing.title = title;
      existing.description = description;
      existing.questions = questions;
      existing.passingScore = passingScore ?? 70;
      await existing.save();
      return NextResponse.json(existing);
    }

    const quiz = await Quiz.create({
      courseId,
      title,
      description,
      questions,
      passingScore: passingScore ?? 70,
    });

    return NextResponse.json(quiz);
  } catch (e) {
    if (isConnectionError(e)) {
      return NextResponse.json({ error: DB_ERROR }, { status: 503 });
    }
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}
