import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { CourseRecommendations } from "@/components/courses/CourseRecommendations";
import { StatCard } from "@/components/dashboard/StatCard";

type EnrollmentItem = {
  _id: string;
  courseId:
    | { _id?: unknown; title?: string; description?: string; lessons?: unknown[] }
    | unknown;
  progress: number;
  completedLessons?: number[];
};

type StudentDashboardProps = {
  session: { user: { name?: string | null; email?: string | null; id?: string } };
  greeting: string;
  role: string;
  enrollments: EnrollmentItem[];
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
};

function getProgressColor(progress: number) {
  if (progress === 100) return "text-emerald-600 dark:text-emerald-400";
  if (progress >= 70) return "text-green-600 dark:text-green-400";
  if (progress >= 30) return "text-amber-600 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
}

export function StudentDashboard({
  session,
  greeting,
  role,
  enrollments,
  totalCourses,
  completedCourses,
  inProgressCourses,
}: StudentDashboardProps) {
  const overallProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
        )
      : 0;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 dark:border-slate-800">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:py-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">{greeting}</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {session.user?.name ?? "Welcome back"}
              </h1>
              <div className="mt-3 flex items-center gap-3">
                <Badge className="border border-white/20 bg-white/20 text-white backdrop-blur-sm">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Badge>
                <span className="text-sm text-white/70">{session.user?.email}</span>
              </div>
              {/* Overall progress in header */}
              {enrollments.length > 0 && (
                <div className="mt-4 max-w-xs">
                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span>Overall Progress</span>
                    <span className="font-semibold text-white">{overallProgress}%</span>
                  </div>
                  <div className="mt-1.5">
                    <ProgressBar value={overallProgress} variant="light" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {(role === "instructor" || role === "admin") && (
                <Link
                  href="/dashboard/create-course"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-indigo-600 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Course
                </Link>
              )}
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-5 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mx-auto max-w-6xl px-4 -mt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            label="Enrolled Courses"
            value={enrollments.length}
            color="indigo"
          />
          <StatCard
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            label="In Progress"
            value={inProgressCourses}
            color="amber"
          />
          <StatCard
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Completed"
            value={completedCourses}
            color="emerald"
          />
          <StatCard
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
            label="Available Courses"
            value={totalCourses}
            color="purple"
          />
        </div>
      </div>

      {/* Enrollments Section */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
              <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              My Learning
            </h2>
          </div>
          {enrollments.length > 0 && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {enrollments.length} {enrollments.length === 1 ? "course" : "courses"}
            </span>
          )}
        </div>

        {enrollments.length === 0 ? (
          <Card className="border-dashed border-slate-300 bg-white/50 backdrop-blur dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex flex-col items-center py-16">
              <div className="mb-5 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 p-5 dark:from-indigo-900/50 dark:to-purple-900/50">
                <svg className="h-10 w-10 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                No courses yet
              </p>
              <p className="mt-1 max-w-xs text-center text-sm text-slate-500 dark:text-slate-400">
                Start your learning journey today by exploring our course catalog
              </p>
              <Link
                href="/courses"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explore Courses
              </Link>
            </div>
          </Card>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map(
              (e: EnrollmentItem, index: number) => {
                const course = e.courseId as { _id?: unknown; title?: string; description?: string; lessons?: unknown[] } | null;
                const courseId = course?._id ?? e.courseId;
                const title = course?.title ?? "Course";
                const description = course?.description ?? "";
                const totalLessons = Array.isArray(course?.lessons) ? course.lessons.length : 0;
                const completedLessonCount = e.completedLessons?.length ?? 0;
                const isComplete = e.progress === 100;
                const notStarted = e.progress === 0;

                return (
                  <li key={String(e._id)} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <Link href={`/courses/${String(courseId)}`} className="group block h-full">
                      <Card className={`relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        isComplete ? 'border-emerald-200 dark:border-emerald-800' : ''
                      }`}>
                        {/* Top color accent bar */}
                        <div className={`absolute top-0 left-0 right-0 h-1 ${
                          isComplete
                            ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                            : notStarted
                            ? "bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700"
                            : "bg-gradient-to-r from-indigo-400 to-purple-500"
                        }`} />

                        {/* Progress indicator */}
                        <div className="mb-4 flex items-center justify-between pt-1">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                            isComplete
                              ? 'bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/50 dark:to-emerald-800/30'
                              : 'bg-gradient-to-br from-indigo-100 to-purple-50 dark:from-indigo-900/50 dark:to-purple-800/30'
                          }`}>
                            {isComplete ? (
                              <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          {isComplete ? (
                            <Badge variant="success">Completed</Badge>
                          ) : notStarted ? (
                            <Badge variant="muted">Not Started</Badge>
                          ) : (
                            <span className={`text-sm font-bold ${getProgressColor(e.progress)}`}>
                              {e.progress}%
                            </span>
                          )}
                        </div>

                        <CardTitle className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mt-2">
                          {description}
                        </CardDescription>

                        {/* Progress bar */}
                        <div className="mt-5">
                          <ProgressBar value={e.progress} />
                          <div className="mt-2.5 flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                              </svg>
                              {completedLessonCount} of {totalLessons} lessons
                            </span>
                            <span className="flex items-center gap-1 font-medium text-indigo-600 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0 translate-x-[-4px] dark:text-indigo-400">
                              {isComplete ? "Review" : notStarted ? "Start" : "Continue"}
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </li>
                );
              }
            )}
          </ul>
        )}

        {/* AI Recommendations Section */}
        <div className="mt-12">
          <CourseRecommendations />
        </div>
      </div>
    </main>
  );
}
