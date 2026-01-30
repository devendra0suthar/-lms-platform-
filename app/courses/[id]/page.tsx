import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EnrollButton } from "@/components/courses/EnrollButton";
import { AddLessonForm } from "@/components/courses/AddLessonForm";
import { LessonPlayer } from "@/components/courses/LessonPlayer";

type Lesson = { title?: string; videoUrl?: string };

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  await connectDB();

  const course = await Course.findById(id)
    .populate("instructor", "name email")
    .lean();
  if (!course) notFound();

  let enrollment: { progress: number; completedLessons: number[] } | null = null;
  if (session?.user?.id) {
    const e = await Enrollment.findOne({
      userId: session.user.id,
      courseId: id,
    }).lean();
    if (e)
      enrollment = {
        progress: e.progress,
        completedLessons: e.completedLessons ?? [],
      };
  }

  const lessons = (course.lessons ?? []) as Lesson[];

  const completedCount = enrollment?.completedLessons?.length ?? 0;
  const instructorName = (course.instructor as { name?: string })?.name ?? "Unknown";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 dark:border-slate-800">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NCAwLTE4IDguMDYtMTggMThzOC4wNiAxOCAxOCAxOCAxOC04LjA2IDE4LTE4LTguMDYtMTgtMTgtMTh6bTAgMmMtOC44NCAwLTE2IDcuMTYtMTYgMTZzNy4xNiAxNiAxNiAxNiAxNi03LjE2IDE2LTE2LTcuMTYtMTYtMTYtMTZ6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <a
            href="/courses"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </a>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {course.title ?? "Untitled Course"}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-white/80">
                {course.description ?? "No description available"}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{instructorName}</p>
                    <p className="text-xs text-white/60">Instructor</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-sm font-medium text-white">{lessons.length} Lessons</span>
                </div>
              </div>
            </div>

            {/* Enroll/Progress Card */}
            <div className="w-full lg:w-80">
              <Card className="border-0 bg-white/10 shadow-xl backdrop-blur-lg">
                {session && !enrollment && (
                  <div className="text-center">
                    <p className="mb-4 text-sm text-white/80">Ready to start learning?</p>
                    <EnrollButton courseId={id} />
                  </div>
                )}
                {enrollment && (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-white">Your Progress</span>
                      <span className="text-2xl font-bold text-white">{enrollment.progress}%</span>
                    </div>
                    <ProgressBar value={enrollment.progress} variant="light" className="mb-4" />
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>{completedCount} of {lessons.length} completed</span>
                      {enrollment.progress === 100 && (
                        <Badge className="bg-emerald-500/20 text-emerald-300">Completed!</Badge>
                      )}
                    </div>
                  </div>
                )}
                {!session && (
                  <div className="text-center">
                    <p className="mb-4 text-sm text-white/80">Sign in to enroll in this course</p>
                    <a
                      href="/login"
                      className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-indigo-600 transition-colors hover:bg-white/90"
                    >
                      Sign In
                    </a>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons Section */}
      <div className="mx-auto max-w-5xl px-4 py-12">
        {session?.user?.id &&
          ((session.user as { role?: string }).role === "instructor" ||
            (session.user as { role?: string }).role === "admin") &&
          String(
            (course.instructor as { _id?: unknown })?._id ?? course.instructor
          ) === session.user.id && (
            <div className="mb-8">
              <AddLessonForm courseId={id} />
            </div>
          )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Course Content
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
          </span>
        </div>

        {lessons.length === 0 ? (
          <Card className="border-dashed border-slate-300 bg-white/50 backdrop-blur dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex flex-col items-center py-12">
              <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                No lessons yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Content is being prepared
              </p>
            </div>
          </Card>
        ) : (
          <ul className="space-y-4">
            {lessons.map((lesson, index) => (
              <li key={index}>
                <LessonPlayer
                  courseId={id}
                  lessonIndex={index}
                  title={lesson.title ?? `Lesson ${index + 1}`}
                  videoUrl={lesson.videoUrl}
                  completed={
                    enrollment?.completedLessons?.includes(index) ?? false
                  }
                  isEnrolled={!!enrollment}
                  completedLessons={enrollment?.completedLessons ?? []}
                  totalLessons={lessons.length}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
