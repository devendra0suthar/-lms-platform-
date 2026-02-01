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

export function ProfileContent() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"courses" | "certificates" | "created">("courses");

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

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="grid gap-4 sm:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Failed to load profile</p>
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
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-4xl font-bold text-white backdrop-blur-sm sm:h-32 sm:w-32 sm:text-5xl">
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">{user.name}</h1>
              <p className="mt-2 text-white/80">{user.email}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <Badge className="bg-white/20 text-white backdrop-blur">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                <span className="text-sm text-white/70">
                  Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
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
        <div className="mb-8 flex gap-2 border-b border-slate-200 dark:border-slate-700">
          <TabButton
            active={activeTab === "courses"}
            onClick={() => setActiveTab("courses")}
            count={enrollments.length}
          >
            My Courses
          </TabButton>
          <TabButton
            active={activeTab === "certificates"}
            onClick={() => setActiveTab("certificates")}
            count={certificates.length}
          >
            Certificates
          </TabButton>
          {isInstructor && (
            <TabButton
              active={activeTab === "created"}
              onClick={() => setActiveTab("created")}
              count={createdCourses.length}
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
                  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                }
                title="No courses yet"
                description="Start your learning journey by enrolling in a course"
                actionLabel="Browse Courses"
                actionHref="/courses"
              />
            ) : (
              enrollments.map((enrollment) => (
                <EnrollmentCard key={enrollment._id} enrollment={enrollment} />
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
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  }
                  title="No certificates yet"
                  description="Complete a course to earn your first certificate"
                />
              </div>
            ) : (
              certificates.map((cert) => (
                <CertificateCard key={cert._id} certificate={cert} />
              ))
            )}
          </div>
        )}

        {activeTab === "created" && isInstructor && (
          <div className="space-y-4">
            {createdCourses.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
                title="No courses created"
                description="Share your knowledge by creating your first course"
                actionLabel="Create Course"
                actionHref="/dashboard/create-course"
              />
            ) : (
              createdCourses.map((course) => (
                <CreatedCourseCard key={course._id} course={course} />
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
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
          : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
      }`}
    >
      {children}
      <span
        className={`rounded-full px-2 py-0.5 text-xs ${
          active
            ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400"
            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        }`}
      >
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
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <Card className="border-dashed">
      <div className="flex flex-col items-center py-12 text-center">
        <div className="mb-4 text-slate-400 dark:text-slate-500">{icon}</div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
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
  return (
    <Card className="transition-shadow hover:shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {enrollment.courseTitle}
            </h3>
            {enrollment.progress === 100 && (
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                Completed
              </Badge>
            )}
          </div>
          <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
            {enrollment.courseDescription}
          </p>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <ProgressBar value={enrollment.progress} />
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {enrollment.progress}%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            {enrollment.completedLessons} of {enrollment.totalLessons} lessons completed
          </p>
        </div>
        <Link
          href={`/courses/${enrollment.courseId}`}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
        >
          {enrollment.progress === 100 ? "Review" : "Continue"}
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
    <Card className="relative overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:border-amber-800 dark:from-amber-900/20 dark:to-orange-900/20">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-200/50 blur-2xl dark:bg-amber-700/30" />
      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-200 text-amber-700 dark:bg-amber-800 dark:text-amber-300">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">{certificate.courseName}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
    <Card className="transition-shadow hover:shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white">{course.title}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
            {course.description}
          </p>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            {course.lessonsCount} {course.lessonsCount === 1 ? "lesson" : "lessons"}
          </p>
        </div>
        <Link
          href={`/courses/${course._id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-800/50"
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
