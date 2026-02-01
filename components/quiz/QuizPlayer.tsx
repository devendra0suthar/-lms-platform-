"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

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

type QuizResult = {
  score: number;
  passed: boolean;
  passingScore: number;
  totalQuestions: number;
  correctAnswers: number;
  results: {
    questionIndex: number;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
  }[];
};

export function QuizPlayer({ quiz }: { quiz: Quiz }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const allAnswered = answers.every((a) => a !== null);

  function resetQuiz() {
    setCurrentQuestion(0);
    setAnswers(new Array(quiz.questions.length).fill(null));
    setSubmitted(false);
    setLoading(false);
    setResult(null);
  }

  function selectAnswer(optionIndex: number) {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  }

  async function submitQuiz() {
    setLoading(true);
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId: quiz._id, answers }),
    });
    const data = await res.json();
    setLoading(false);
    setSubmitted(true);
    setResult(data);
  }

  if (submitted && result) {
    return (
      <Card className="mx-auto max-w-2xl">
        <div className="text-center">
          <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${result.passed ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
            {result.passed ? (
              <svg className="h-10 w-10 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {result.passed ? "Congratulations!" : "Keep Learning!"}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {result.passed ? "You passed the quiz!" : "You didn't pass this time, but you can try again."}
          </p>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{result.score}%</p>
              <p className="text-sm text-slate-500">Your Score</p>
            </div>
            <div className="h-12 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{result.correctAnswers}/{result.totalQuestions}</p>
              <p className="text-sm text-slate-500">Correct</p>
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <Button variant="outline" onClick={resetQuiz}>
              Try Again
            </Button>
            <Button onClick={() => router.back()}>
              Back to Course
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between">
        <Badge variant="primary">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </Badge>
        <div className="flex gap-1">
          {quiz.questions.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-8 rounded-full transition-colors ${
                answers[i] !== null
                  ? 'bg-indigo-500'
                  : i === currentQuestion
                  ? 'bg-indigo-200 dark:bg-indigo-800'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        {question.question}
      </h3>

      {/* Options */}
      <div className="mt-6 space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => selectAnswer(index)}
            className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
              answers[currentQuestion] === index
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                answers[currentQuestion] === index
                  ? 'border-indigo-500 bg-indigo-500 text-white'
                  : 'border-slate-300 dark:border-slate-600'
              }`}>
                {String.fromCharCode(65 + index)}
              </div>
              <span className="text-slate-700 dark:text-slate-300">{option}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion((c) => c - 1)}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        {isLastQuestion ? (
          <Button onClick={submitQuiz} disabled={!allAnswered || loading}>
            {loading ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : (
          <Button onClick={() => setCurrentQuestion((c) => c + 1)}>
            Next
          </Button>
        )}
      </div>
    </Card>
  );
}
