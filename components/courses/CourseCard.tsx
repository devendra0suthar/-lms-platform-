import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export type CourseCardItem = {
  _id: string;
  title?: string;
  description?: string;
  lessons?: unknown[];
  instructor?: { name?: string };
};

type CourseCardProps = {
  course: CourseCardItem;
};

const gradients = [
  "from-indigo-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-rose-600",
  "from-cyan-500 to-blue-600",
  "from-pink-500 to-rose-600",
  "from-violet-500 to-purple-600",
];

function getGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export function CourseCard({ course }: CourseCardProps) {
  const lessonCount = Array.isArray(course.lessons) ? course.lessons.length : 0;
  const gradient = getGradient(String(course._id));
  const initials = (course.title ?? "C")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <Link href={`/courses/${course._id}`} className="group block h-full">
      <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:shadow-slate-900/50">
        {/* Course thumbnail/gradient header */}
        <div className={`relative h-36 bg-gradient-to-br ${gradient}`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-white/90">{initials}</span>
          </div>
          {/* Decorative elements */}
          <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
          {/* Lesson count badge */}
          <div className="absolute right-3 top-3">
            <Badge className="border border-white/20 bg-white/20 text-white backdrop-blur-sm">
              {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
            {course.title ?? "Untitled Course"}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {course.description || "No description available"}
          </p>

          {/* Footer */}
          <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
              <svg className="h-4 w-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                {course.instructor?.name ?? "Unknown Instructor"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">Instructor</p>
            </div>
            <div className="flex items-center text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-indigo-400">
              <span className="text-sm font-medium">View</span>
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
