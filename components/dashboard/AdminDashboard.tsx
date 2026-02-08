"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
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

function getProgressColor(progress: number) {
  if (progress === 100) return "text-emerald-600 dark:text-emerald-400";
  if (progress >= 70) return "text-green-600 dark:text-green-400";
  if (progress >= 30) return "text-amber-600 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
}

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
  const [courseSearch, setCourseSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editStudentName, setEditStudentName] = useState("");
  const [savingStudent, setSavingStudent] = useState(false);

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

  function startStudentEdit(userId: string, currentName: string) {
    setEditingStudentId(userId);
    setEditStudentName(currentName);
  }

  async function handleStudentNameSave(userId: string) {
    if (!editStudentName.trim()) return;
    setSavingStudent(true);
    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editStudentName.trim() }),
    });
    setSavingStudent(false);
    if (res.ok) {
      setEditingStudentId(null);
      router.refresh();
    }
  }

  function getEnrollmentCount(courseId: string) {
    return allEnrollments.filter((e) => {
      const cId = typeof e.courseId === "string" ? e.courseId : e.courseId?._id;
      return cId === courseId;
    }).length;
  }

  const filteredCourses = useMemo(() => {
    if (!courseSearch.trim()) return allCourses;
    const search = courseSearch.toLowerCase();
    return allCourses.filter(
      (c) =>
        c.title?.toLowerCase().includes(search) ||
        c.description?.toLowerCase().includes(search) ||
        c.instructor?.name?.toLowerCase().includes(search)
    );
  }, [allCourses, courseSearch]);

  const filteredEnrollments = useMemo(() => {
    if (!studentSearch.trim()) return allEnrollments;
    const search = studentSearch.toLowerCase();
    return allEnrollments.filter((e) => {
      const user = typeof e.userId === "string" ? null : e.userId;
      const course = typeof e.courseId === "string" ? null : e.courseId;
      return (
        user?.name?.toLowerCase().includes(search) ||
        user?.email?.toLowerCase().includes(search) ||
        course?.title?.toLowerCase().includes(search)
      );
    });
  }, [allEnrollments, studentSearch]);

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
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === "courses"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Manage Courses
            <span className={`rounded-full px-2 py-0.5 text-xs ${
              activeTab === "courses"
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
            }`}>
              {allCourses.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === "students"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Student Progress
            <span className={`rounded-full px-2 py-0.5 text-xs ${
              activeTab === "students"
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
            }`}>
              {allEnrollments.length}
            </span>
          </button>
        </div>

        {/* Manage Courses Tab */}
        {activeTab === "courses" && (
          <div>
            {/* Course Search */}
            {allCourses.length > 0 && (
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                  <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
                  />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {filteredCourses.length} of {allCourses.length} courses
                </p>
              </div>
            )}

            {allCourses.length === 0 ? (
              <Card className="border-dashed border-slate-300 bg-white/50 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="flex flex-col items-center py-16">
                  <div className="mb-5 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 p-5 dark:from-purple-900/50 dark:to-indigo-900/50">
                    <svg className="h-10 w-10 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    No courses yet
                  </p>
                  <p className="mt-1 max-w-xs text-center text-sm text-slate-500 dark:text-slate-400">
                    Create your first course to start building your learning platform
                  </p>
                  <Link
                    href="/dashboard/create-course"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Course
                  </Link>
                </div>
              </Card>
            ) : filteredCourses.length === 0 ? (
              <Card className="border-dashed border-slate-300 bg-white/50 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="flex flex-col items-center py-12">
                  <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                    <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                    No matching courses
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Try a different search term
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map((course, index) => {
                  const isEditing = editingCourseId === course._id;
                  const enrollCount = getEnrollmentCount(course._id);
                  const lessonCount = Array.isArray(course.lessons) ? course.lessons.length : 0;

                  return (
                    <div
                      key={course._id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 40}ms` }}
                    >
                      <Card className={`overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                        isEditing ? "ring-2 ring-indigo-500/30" : ""
                      }`}>
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-slate-700">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
                                <svg className="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </div>
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">Editing Course</span>
                            </div>
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
                            <div className="flex gap-2 border-t border-slate-100 pt-4 dark:border-slate-700">
                              <Button
                                size="sm"
                                onClick={() => handleEditSave(course._id)}
                                disabled={saving}
                              >
                                {saving ? "Saving..." : "Save Changes"}
                              </Button>
                              <Button
                                variant="ghost"
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
                            <div className="flex min-w-0 flex-1 items-start gap-4">
                              {/* Course icon */}
                              <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40">
                                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Link
                                    href={`/courses/${course._id}`}
                                    className="text-base font-semibold text-slate-900 transition-colors hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
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
                                <p className="mt-1.5 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                                  {course.description || "No description"}
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                    {course.instructor?.name?.charAt(0).toUpperCase() ?? "?"}
                                  </div>
                                  <span className="text-xs text-slate-400 dark:text-slate-500">
                                    {course.instructor?.name ?? "Unknown instructor"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex shrink-0 gap-2 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
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
                    </div>
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
              <div className="relative">
                <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by student name, email, or course title..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
                />
              </div>
              {studentSearch && (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Showing {filteredEnrollments.length} of {allEnrollments.length} enrollments
                </p>
              )}
            </div>

            {filteredEnrollments.length === 0 ? (
              <Card className="border-dashed border-slate-300 bg-white/50 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="flex flex-col items-center py-16">
                  <div className="mb-5 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 p-5 dark:from-indigo-900/50 dark:to-purple-900/50">
                    <svg className="h-10 w-10 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    {studentSearch ? "No matching results" : "No enrollments yet"}
                  </p>
                  <p className="mt-1 max-w-xs text-center text-sm text-slate-500 dark:text-slate-400">
                    {studentSearch
                      ? "Try a different search term"
                      : "Students will appear here once they enroll in courses"}
                  </p>
                </div>
              </Card>
            ) : (
              <>
                {/* Table Header (desktop only) */}
                <div className="hidden sm:flex mb-2 px-6 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <div className="w-1/3">Student</div>
                  <div className="w-1/5">Course</div>
                  <div className="flex-1">Progress</div>
                  <div className="w-24 text-center">Status</div>
                  <div className="w-20 text-right">Action</div>
                </div>

                <div className="space-y-2">
                  {filteredEnrollments.map((enrollment, index) => {
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

                    const userId = user?._id ?? "";
                    const isEditingStudent = editingStudentId === userId;

                    return (
                      <div
                        key={enrollment._id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <Card className={`transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                          isEditingStudent ? "ring-2 ring-indigo-500/30" : ""
                        }`}>
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            {/* Student Info */}
                            <div className="flex items-center gap-3 sm:w-1/3">
                              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                                isComplete
                                  ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                                  : "bg-gradient-to-br from-indigo-400 to-indigo-600"
                              }`}>
                                {(isEditingStudent ? editStudentName : user?.name)?.charAt(0).toUpperCase() ?? "?"}
                              </div>
                              <div className="min-w-0 flex-1">
                                {isEditingStudent ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={editStudentName}
                                      onChange={(e) => setEditStudentName(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") handleStudentNameSave(userId);
                                        if (e.key === "Escape") setEditingStudentId(null);
                                      }}
                                      autoFocus
                                      className="w-full rounded-lg border border-indigo-300 bg-white px-2.5 py-1 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-indigo-600 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400"
                                    />
                                    <button
                                      onClick={() => handleStudentNameSave(userId)}
                                      disabled={savingStudent || !editStudentName.trim()}
                                      className="shrink-0 rounded-lg bg-indigo-600 p-1.5 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                                      title="Save"
                                    >
                                      {savingStudent ? (
                                        <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                      ) : (
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </button>
                                    <button
                                      onClick={() => setEditingStudentId(null)}
                                      disabled={savingStudent}
                                      className="shrink-0 rounded-lg bg-slate-100 p-1.5 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
                                      title="Cancel"
                                    >
                                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <p className="truncate font-medium text-slate-900 dark:text-white">
                                      {user?.name ?? "Unknown"}
                                    </p>
                                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                      {user?.email ?? ""}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Course Info */}
                            <div className="sm:w-1/5">
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {course?.title ?? "Unknown Course"}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                                {completedCount} of {totalLessons} lessons
                              </p>
                            </div>

                            {/* Progress */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <ProgressBar value={enrollment.progress} />
                                </div>
                                <span className={`min-w-[3ch] text-right text-sm font-bold ${getProgressColor(enrollment.progress)}`}>
                                  {enrollment.progress}%
                                </span>
                              </div>
                            </div>

                            {/* Status */}
                            <div className="sm:w-24 sm:text-center">
                              {isComplete ? (
                                <Badge variant="success">Completed</Badge>
                              ) : enrollment.progress > 0 ? (
                                <Badge variant="primary">In Progress</Badge>
                              ) : (
                                <Badge variant="muted">Not Started</Badge>
                              )}
                            </div>

                            {/* Edit Action */}
                            <div className="sm:w-20 sm:text-right">
                              {!isEditingStudent && user?._id && (
                                <button
                                  onClick={() => startStudentEdit(userId, user?.name ?? "")}
                                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-indigo-400"
                                  title="Edit name"
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                                </button>
                              )}
                            </div>
                          </div>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
