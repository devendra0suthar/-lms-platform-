"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

type Enrollment = {
  _id: string;
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
};

type Certificate = {
  _id: string;
  certificateId: string;
  courseName: string;
  completedAt: string;
};

type CreatedCourse = {
  _id: string;
  title: string;
  description: string;
  lessonsCount: number;
};

type Stats = {
  totalEnrolled: number;
  completedCourses: number;
  inProgressCourses: number;
  totalCertificates: number;
  totalLessonsCompleted: number;
  coursesCreated: number;
};

type UserProfile = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type ProfileData = {
  user: UserProfile;
  stats: Stats;
  enrollments: Enrollment[];
  certificates: Certificate[];
  createdCourses: CreatedCourse[];
};

function getProgressColor(progress: number) {
  if (progress === 100) return "text-emerald-600 dark:text-emerald-400";
  if (progress >= 70) return "text-green-600 dark:text-green-400";
  if (progress >= 30) return "text-amber-600 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
}

export function ProfileContent() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"courses" | "certificates" | "created">("courses");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  }

  function startEditingName() {
    setNameInput(profile?.user.name ?? "");
    setEditingName(true);
  }

  async function handleNameSave() {
    if (!nameInput.trim()) return;
    setSavingName(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput.trim() }),
      });
      if (res.ok) {
        setEditingName(false);
        fetchProfile();
      }
    } catch (error) {
      console.error("Failed to update name:", error);
    } finally {
      setSavingName(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 dark:border-slate-800">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
            <div className="animate-pulse flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="h-24 w-24 rounded-full bg-white/20 sm:h-32 sm:w-32" />
              <div className="space-y-3 text-center sm:text-left">
                <div className="h-8 w-48 rounded-lg bg-white/20" />
                <div className="h-5 w-56 rounded-lg bg-white/10" />
                <div className="h-6 w-32 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 -mt-8">
          <div className="animate-pulse grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-white shadow-lg dark:bg-slate-800" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl bg-red-100 p-4 dark:bg-red-900/50">
            <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Failed to load profile</p>
          <button
            onClick={() => { setLoading(true); fetchProfile(); }}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const { user, stats, enrollments, certificates, createdCourses } = profile;
  const isInstructor = user.role === "instructor" || user.role === "admin";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Profile Header */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 dark:border-slate-800">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-4xl font-bold text-white ring-4 ring-white/20 backdrop-blur-sm sm:h-32 sm:w-32 sm:text-5xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {/* Role indicator dot */}
              <div className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white/30 ${
                user.role === "admin"
                  ? "bg-amber-400"
                  : user.role === "instructor"
                  ? "bg-emerald-400"
                  : "bg-indigo-400"
              }`} />
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleNameSave();
                      if (e.key === "Escape") setEditingName(false);
                    }}
                    autoFocus
                    className="rounded-xl border-2 border-white/30 bg-white/10 px-4 py-2 text-2xl font-bold text-white placeholder-white/50 backdrop-blur-sm focus:border-white/60 focus:outline-none sm:text-3xl"
                  />
                  <button
                    onClick={handleNameSave}
                    disabled={savingName || !nameInput.trim()}
                    className="rounded-xl bg-white/20 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/30 disabled:opacity-50"
                    title="Save"
                  >
                    {savingName ? (
                      <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => setEditingName(false)}
                    disabled={savingName}
                    className="rounded-xl bg-white/10 p-2.5 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
                    title="Cancel"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="group flex items-center justify-center gap-3 sm:justify-start">
                  <h1 className="text-3xl font-bold text-white sm:text-4xl">{user.name}</h1>
                  <button
                    onClick={startEditingName}
                    className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white/80 group-hover:text-white/60"
                    title="Edit name"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              )}
              <p className="mt-2 flex items-center justify-center gap-2 text-white/80 sm:justify-start">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {user.email}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <Badge className="border border-white/20 bg-white/20 text-white backdrop-blur-sm">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                <span className="flex items-center gap-1.5 text-sm text-white/70">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
              </div>
              {/* Quick stats in header */}
              <div className="mt-4 flex items-center justify-center gap-4 sm:justify-start">
                <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {stats.totalEnrolled} enrolled
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {stats.totalLessonsCompleted} lessons done
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mx-auto max-w-5xl px-4 -mt-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            label="Enrolled Courses"
            value={stats.totalEnrolled}
            color="indigo"
          />
          <StatCard
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Completed"
            value={stats.completedCourses}
            color="emerald"
          />
          <StatCard
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            label="In Progress"
            value={stats.inProgressCourses}
            color="amber"
          />
          <StatCard
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
            label="Certificates"
            value={stats.totalCertificates}
            color="purple"
          />
        </div>
      </div>

      {/* Content Tabs */}
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Tab Navigation */}
        <div className="mb-8 flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <TabButton
            active={activeTab === "courses"}
            onClick={() => setActiveTab("courses")}
            count={enrollments.length}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          >
            My Courses
          </TabButton>
          <TabButton
            active={activeTab === "certificates"}
            onClick={() => setActiveTab("certificates")}
            count={certificates.length}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          >
            Certificates
          </TabButton>
          {isInstructor && (
            <TabButton
              active={activeTab === "created"}
              onClick={() => setActiveTab("created")}
              count={createdCourses.length}
              icon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
            >
              Created Courses
            </TabButton>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === "courses" && (
          <div className="space-y-4">
            {enrollments.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
                title="No courses yet"
                description="Start your learning journey by enrolling in a course"
                actionLabel="Browse Courses"
                actionHref="/courses"
                color="indigo"
              />
            ) : (
              enrollments.map((enrollment, index) => (
                <div key={enrollment._id} className="animate-fade-in" style={{ animationDelay: `${index * 40}ms` }}>
                  <EnrollmentCard enrollment={enrollment} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "certificates" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {certificates.length === 0 ? (
              <div className="sm:col-span-2">
                <EmptyState
                  icon={
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  }
                  title="No certificates yet"
                  description="Complete a course to earn your first certificate"
                  color="amber"
                />
              </div>
            ) : (
              certificates.map((cert, index) => (
                <div key={cert._id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <CertificateCard certificate={cert} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "created" && isInstructor && (
          <div className="space-y-4">
            {createdCourses.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
                title="No courses created"
                description="Share your knowledge by creating your first course"
                actionLabel="Create Course"
                actionHref="/dashboard/create-course"
                color="purple"
              />
            ) : (
              createdCourses.map((course, index) => (
                <div key={course._id} className="animate-fade-in" style={{ animationDelay: `${index * 40}ms` }}>
                  <CreatedCourseCard course={course} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "indigo" | "emerald" | "amber" | "purple";
}) {
  const colorClasses = {
    indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400",
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400",
  };

  return (
    <Card className="relative overflow-hidden border-0 bg-white shadow-lg dark:bg-slate-800">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function TabButton({
  active,
  onClick,
  count,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{children}</span>
      <span className={`rounded-full px-2 py-0.5 text-xs ${
        active
          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
          : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
      }`}>
        {count}
      </span>
    </button>
  );
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  color = "indigo",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  color?: "indigo" | "amber" | "purple";
}) {
  const bgColors = {
    indigo: "from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50",
    amber: "from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50",
    purple: "from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50",
  };
  const iconColors = {
    indigo: "text-indigo-600 dark:text-indigo-400",
    amber: "text-amber-600 dark:text-amber-400",
    purple: "text-purple-600 dark:text-purple-400",
  };

  return (
    <Card className="border-dashed border-slate-300 bg-white/50 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="flex flex-col items-center py-16 text-center">
        <div className={`mb-5 rounded-2xl bg-gradient-to-br ${bgColors[color]} p-5 ${iconColors[color]}`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
        <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">{description}</p>
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30"
          >
            {actionLabel}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </Card>
  );
}

function EnrollmentCard({ enrollment }: { enrollment: Enrollment }) {
  const isComplete = enrollment.progress === 100;
  const notStarted = enrollment.progress === 0;

  return (
    <Card className={`overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
      isComplete ? "border-emerald-200 dark:border-emerald-800" : ""
    }`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          {/* Course status icon */}
          <div className={`hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            isComplete
              ? "bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/50 dark:to-emerald-800/30"
              : "bg-gradient-to-br from-indigo-100 to-purple-50 dark:from-indigo-900/50 dark:to-purple-800/30"
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
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {enrollment.courseTitle}
              </h3>
              {isComplete ? (
                <Badge variant="success">Completed</Badge>
              ) : notStarted ? (
                <Badge variant="muted">Not Started</Badge>
              ) : null}
            </div>
            <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
              {enrollment.courseDescription}
            </p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex-1 max-w-xs">
                <ProgressBar value={enrollment.progress} />
              </div>
              <span className={`text-sm font-bold ${getProgressColor(enrollment.progress)}`}>
                {enrollment.progress}%
              </span>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              {enrollment.completedLessons} of {enrollment.totalLessons} lessons completed
            </p>
          </div>
        </div>
        <Link
          href={`/courses/${enrollment.courseId}`}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
            isComplete
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-800/50"
              : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-800/50"
          }`}
        >
          {isComplete ? "Review" : notStarted ? "Start" : "Continue"}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </Card>
  );
}

function CertificateCard({ certificate }: { certificate: Certificate }) {
  return (
    <Card className="relative overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-amber-800 dark:from-amber-900/20 dark:to-orange-900/20">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-200/50 blur-2xl dark:bg-amber-700/30" />
      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-300 text-amber-700 dark:from-amber-800 dark:to-amber-700 dark:text-amber-300">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-white">{certificate.courseName}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Completed {new Date(certificate.completedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="mt-2 font-mono text-xs text-slate-400 dark:text-slate-500">
              ID: {certificate.certificateId}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function CreatedCourseCard({ course }: { course: CreatedCourse }) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40">
            <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">{course.title}</h3>
            <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
              {course.description}
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.lessonsCount} {course.lessonsCount === 1 ? "lesson" : "lessons"}
            </p>
          </div>
        </div>
        <Link
          href={`/courses/${course._id}`}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-100 px-5 py-2.5 text-sm font-semibold text-indigo-700 transition-all hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-800/50"
        >
          View Course
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </Card>
  );
}
