"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { QuizPlayer } from "./QuizPlayer";

type Question = {
  _id: string;
  question: string;
  options: string[];
};

type Quiz = {
  _id: string;
  title: string;
  description?: string;
  questions: Question[];
  passingScore: number;
};

export function CourseQuiz({ courseId, isEnrolled }: { courseId: string; isEnrolled: boolean }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [courseId]);

  async function fetchQuiz() {
    const res = await fetch(`/api/quiz?courseId=${courseId}`);
    const data = await res.json();
    if (res.ok && data.quiz) {
      setQuiz(data.quiz);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-20 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </Card>
    );
  }

  if (!quiz) {
    return null; // No quiz for this course
  }

  if (!isEnrolled) {
    return (
      <Card className="border-dashed">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/50">
            <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{quiz.title}</h3>
            <p className="text-sm text-slate-500">Enroll in this course to take the quiz</p>
          </div>
        </div>
      </Card>
    );
  }

  if (showQuiz) {
    return <QuizPlayer quiz={quiz} />;
  }

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/50">
            <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{quiz.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {quiz.questions.length} questions • {quiz.passingScore}% to pass
            </p>
            {quiz.description && (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{quiz.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowQuiz(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Start Quiz
        </button>
      </div>
    </Card>
  );
}
