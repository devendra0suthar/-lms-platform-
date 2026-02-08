"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/dashboard/StatCard";

type CourseItem = {
  _id: string;
  title?: string;
  description?: string;
  lessons?: unknown[];
  instructor?: { _id?: string; name?: string; email?: string };
};

type EnrollmentItem = {
  _id: string;
  userId: { _id?: string; name?: string; email?: string } | string;
  courseId: { _id?: string; title?: string; description?: string; lessons?: unknown[] } | string;
  progress: number;
  completedLessons?: number[];
};

type AdminDashboardProps = {
  session: { user: { name?: string | null; email?: string | null; id?: string } };
  greeting: string;
  role: string;
  allCourses: CourseItem[];
  allEnrollments: EnrollmentItem[];
  totalStudents: number;
  totalCourses: number;
};

export function AdminDashboard({
  session,
  greeting,
  allCourses,
  allEnrollments,
  totalStudents,
  totalCourses,
}: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"courses" | "students">("courses");
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [studentSearch, setStudentSearch] = useState("");

  const avgCompletion =
    allEnrollments.length > 0
      ? Math.round(
          allEnrollments.reduce((sum, e) => sum + e.progress, 0) /
            allEnrollments.length
        )
      : 0;

  function startEdit(course: CourseItem) {
    setEditingCourseId(course._id);
    setEditTitle(course.title ?? "");
    setEditDescription(course.description ?? "");
  }

  async function handleEditSave(courseId: string) {
    setSaving(true);
    const res = await fetch(`/api/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, description: editDescription }),
    });
    setSaving(false);
    if (res.ok) {
      setEditingCourseId(null);
      router.refresh();
    }
  }

  async function handleDelete(courseId: string, courseTitle: string) {
    if (
      !window.confirm(
        `Delete "${courseTitle}"? This will also remove all enrollments for this course.`
      )
    )
      return;
    setDeleting(courseId);
    const res = await fetch(`/api/courses/${courseId}`, { method: "DELETE" });
    setDeleting(null);
    if (res.ok) {
      router.refresh();
    }
  }

  function getEnrollmentCount(courseId: string) {
    return allEnrollments.filter((e) => {
      const cId = typeof e.courseId === "string" ? e.courseId : e.courseId?._id;
      return cId === courseId;
    }).length;
  }

  const filteredEnrollments = allEnrollments.filter((e) => {
    if (!studentSearch.trim()) return true;
    const search = studentSearch.toLowerCase();
    const user = typeof e.userId === "string" ? null : e.userId;
    const course = typeof e.courseId === "string" ? null : e.courseId;
    return (
      user?.name?.toLowerCase().includes(search) ||
      user?.email?.toLowerCase().includes(search) ||
      course?.title?.toLowerCase().includes(search)
    );
  });

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
                  Admin
                </Badge>
                <span className="text-sm text-white/70">{session.user?.email}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/create-course"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-indigo-600 shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Course
              </Link>
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
            label="Total Courses"
            value={totalCourses}
            color="purple"
          />
          <StatCard
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            label="Total Students"
            value={totalStudents}
            color="indigo"
          />
          <StatCard
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            label="Active Enrollments"
            value={allEnrollments.length}
            color="amber"
          />
          <StatCard
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Avg Completion"
            value={`${avgCompletion}%`}
            color="emerald"
          />
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Tab Switcher */}
        <div className="mb-6 flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setActiveTab("courses")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === "courses"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Manage Courses
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === "students"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Student Progress
          </button>
        </div>

        {/* Manage Courses Tab */}
        {activeTab === "courses" && (
          <div>
            {allCourses.length === 0 ? (
              <Card className="border-dashed border-slate-300 bg-white/50 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="flex flex-col items-center py-12">
                  <div className="mb-4 rounded-full bg-purple-100 p-4 dark:bg-purple-900/50">
                    <svg className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                    No courses yet
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Create your first course to get started
                  </p>
                  <Link
                    href="/dashboard/create-course"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-700"
                  >
                    Create Course
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {allCourses.map((course) => {
                  const isEditing = editingCourseId === course._id;
                  const enrollCount = getEnrollmentCount(course._id);
                  const lessonCount = Array.isArray(course.lessons) ? course.lessons.length : 0;

                  return (
                    <Card key={course._id} className="transition-all duration-200">
                      {isEditing ? (
                        <div className="space-y-4">
                          <Input
                            label="Title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                              Description
                            </label>
                            <textarea
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
                              rows={3}
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleEditSave(course._id)}
                              disabled={saving}
                            >
                              {saving ? "Saving..." : "Save"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingCourseId(null)}
                              disabled={saving}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Link
                                href={`/courses/${course._id}`}
                                className="font-semibold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                              >
                                {course.title ?? "Untitled Course"}
                              </Link>
                              <Badge variant="default">
                                {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
                              </Badge>
                              <Badge variant="primary">
                                {enrollCount} {enrollCount === 1 ? "student" : "students"}
                              </Badge>
                            </div>
                            <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                              {course.description || "No description"}
                            </p>
                            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                              Instructor: {course.instructor?.name ?? "Unknown"}
                            </p>
                          </div>
                          <div className="flex shrink-0 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEdit(course)}
                            >
                              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
                              onClick={() => handleDelete(course._id, course.title ?? "Untitled")}
                              disabled={deleting === course._id}
                            >
                              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              {deleting === course._id ? "Deleting..." : "Delete"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Student Progress Tab */}
        {activeTab === "students" && (
          <div>
            {/* Search */}
            <div className="mb-6">
              <Input
                label=""
                type="text"
                placeholder="Search by student name, email, or course title..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />
            </div>

            {filteredEnrollments.length === 0 ? (
              <Card className="border-dashed border-slate-300 bg-white/50 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="flex flex-col items-center py-12">
                  <div className="mb-4 rounded-full bg-indigo-100 p-4 dark:bg-indigo-900/50">
                    <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                    {studentSearch ? "No matching results" : "No enrollments yet"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {studentSearch
                      ? "Try a different search term"
                      : "Students will appear here once they enroll in courses"}
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredEnrollments.map((enrollment) => {
                  const user =
                    typeof enrollment.userId === "string"
                      ? null
                      : enrollment.userId;
                  const course =
                    typeof enrollment.courseId === "string"
                      ? null
                      : enrollment.courseId;
                  const totalLessons = Array.isArray(course?.lessons)
                    ? course.lessons.length
                    : 0;
                  const completedCount =
                    enrollment.completedLessons?.length ?? 0;
                  const isComplete = enrollment.progress === 100;

                  return (
                    <Card key={enrollment._id} className="transition-all duration-200">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* Student Info */}
                        <div className="flex items-center gap-3 sm:w-1/3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            {user?.name?.charAt(0).toUpperCase() ?? "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-900 dark:text-white">
                              {user?.name ?? "Unknown"}
                            </p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                              {user?.email ?? ""}
                            </p>
                          </div>
                        </div>

                        {/* Course Info */}
                        <div className="sm:w-1/4">
                          <CardTitle className="text-sm">
                            {course?.title ?? "Unknown Course"}
                          </CardTitle>
                        </div>

                        {/* Progress */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <ProgressBar value={enrollment.progress} />
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              {isComplete ? (
                                <Badge variant="success">Completed</Badge>
                              ) : (
                                <Badge variant="primary">{enrollment.progress}%</Badge>
                              )}
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {completedCount} of {totalLessons} lessons
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
