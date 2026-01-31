"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { DatabaseUnavailable } from "@/components/ui/DatabaseUnavailable";
import { CourseCard, type CourseCardItem } from "./CourseCard";

type CoursesPageProps =
  | { courses: CourseCardItem[]; dbUnavailable?: false }
  | { dbUnavailable: true; errorMessage?: string; courses?: never };

export function CoursesPage(props: CoursesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "title" | "lessons">("default");

  if (props.dbUnavailable) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <CoursesPageHeader coursesCount={0} />
          <DatabaseUnavailable errorMessage={props.errorMessage} />
        </div>
      </main>
    );
  }

  const courses = props.courses;

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let result = courses.filter((course) => {
      const query = searchQuery.toLowerCase();
      const title = (course.title ?? "").toLowerCase();
      const description = (course.description ?? "").toLowerCase();
      const instructor = (course.instructor?.name ?? "").toLowerCase();
      return title.includes(query) || description.includes(query) || instructor.includes(query);
    });

    if (sortBy === "title") {
      result = [...result].sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
    } else if (sortBy === "lessons") {
      result = [...result].sort((a, b) => {
        const aLessons = Array.isArray(a.lessons) ? a.lessons.length : 0;
        const bLessons = Array.isArray(b.lessons) ? b.lessons.length : 0;
        return bLessons - aLessons;
      });
    }

    return result;
  }, [courses, searchQuery, sortBy]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <CoursesPageHeader coursesCount={courses.length} />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        {/* Search and Filter Bar */}
        {courses.length > 0 && (
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <option value="default">Default</option>
                <option value="title">Title (A-Z)</option>
                <option value="lessons">Most Lessons</option>
              </select>
            </div>
          </div>
        )}

        {/* Results count when searching */}
        {searchQuery && (
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Found {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"} for "{searchQuery}"
          </p>
        )}

        {courses.length === 0 ? (
          <Card className="border-dashed border-slate-300 bg-white/50 backdrop-blur dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex flex-col items-center py-12">
              <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                No courses available yet
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
                Check back soon for new learning opportunities
              </p>
            </div>
          </Card>
        ) : filteredCourses.length === 0 ? (
          <Card className="border-dashed border-slate-300 bg-white/50 backdrop-blur dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex flex-col items-center py-12">
              <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                No courses found
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
                Try a different search term
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Clear search
              </button>
            </div>
          </Card>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course, index) => (
              <li key={String(course._id)} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <CourseCard course={course} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function CoursesPageHeader({ coursesCount }: { coursesCount: number }) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl dark:bg-indigo-900/20" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-100/50 blur-3xl dark:bg-purple-900/20" />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Learn at your own pace
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Explore Courses
            </h1>
            <p className="mt-3 max-w-xl text-lg text-slate-600 dark:text-slate-400">
              Discover courses taught by expert instructors. Build new skills and advance your career.
            </p>
          </div>
          {coursesCount > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur dark:bg-slate-800/80">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                {coursesCount}
              </span>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {coursesCount === 1 ? "Course" : "Courses"} available
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
