"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type LessonPlayerProps = {
  courseId: string;
  lessonIndex: number;
  title: string;
  videoUrl?: string;
  completed: boolean;
  isEnrolled: boolean;
  completedLessons: number[];
  totalLessons: number;
};

export function LessonPlayer({
  courseId,
  lessonIndex,
  title,
  videoUrl,
  completed,
  isEnrolled,
  completedLessons,
  totalLessons,
}: LessonPlayerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function markComplete() {
    if (!isEnrolled) return;
    setLoading(true);
    const next = [...new Set([...completedLessons, lessonIndex])].sort(
      (a, b) => a - b
    );
    const progress =
      totalLessons > 0 ? Math.round((next.length / totalLessons) * 100) : 0;
    await fetch("/api/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, completedLessons: next, progress }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 ${
        completed
          ? "border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:border-l-emerald-400 dark:bg-emerald-950/20"
          : "hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* Lesson Number & Status */}
        <div className="flex sm:flex-col items-center gap-3 sm:gap-2">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold transition-colors ${
              completed
                ? "bg-emerald-500 text-white"
                : "bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-slate-700 dark:text-slate-300 dark:group-hover:bg-indigo-900/50 dark:group-hover:text-indigo-400"
            }`}
          >
            {completed ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              lessonIndex + 1
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <CardTitle className="flex flex-wrap items-center gap-2">
                <span className="truncate">{title}</span>
                {completed && (
                  <Badge variant="success" className="shrink-0">
                    Completed
                  </Badge>
                )}
              </CardTitle>
              {videoUrl && (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Video lesson
                </p>
              )}
            </div>
            {isEnrolled && !completed && (
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={markComplete}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving
                  </span>
                ) : (
                  "Mark Complete"
                )}
              </Button>
            )}
          </div>

          {/* Video Player */}
          {videoUrl && (
            <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl bg-slate-900">
              {videoUrl.includes("res.cloudinary.com") ? (
                <video
                  src={videoUrl}
                  controls
                  className="h-full w-full object-contain"
                  playsInline
                />
              ) : (
                <iframe
                  src={videoUrl}
                  title={title}
                  className="h-full w-full"
                  allowFullScreen
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
