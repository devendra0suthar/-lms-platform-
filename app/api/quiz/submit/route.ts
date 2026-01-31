import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB, { isConnectionError } from "@/lib/db";
import Quiz from "@/models/Quiz";
import QuizAttempt from "@/models/QuizAttempt";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quizId, answers } = await request.json();

    if (!quizId || !answers) {
      return NextResponse.json({ error: "quizId and answers are required" }, { status: 400 });
    }

    await connectDB();

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Calculate score
    let correct = 0;
    const results = quiz.questions.map((q: { correctAnswer: number }, index: number) => {
      const isCorrect = answers[index] === q.correctAnswer;
      if (isCorrect) correct++;
      return {
        questionIndex: index,
        selectedAnswer: answers[index],
        correctAnswer: q.correctAnswer,
        isCorrect,
      };
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Save attempt
    const attempt = await QuizAttempt.create({
      userId: session.user.id,
      quizId,
      courseId: quiz.courseId,
      answers,
      score,
      passed,
    });

    return NextResponse.json({
      attemptId: attempt._id,
      score,
      passed,
      passingScore: quiz.passingScore,
      totalQuestions: quiz.questions.length,
      correctAnswers: correct,
      results,
    });
  } catch (e) {
    if (isConnectionError(e)) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
  }
}
