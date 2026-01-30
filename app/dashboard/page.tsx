import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  await connectDB();
  const enrollments = await Enrollment.find({ userId: session.user.id })
    .populate("courseId", "title description")
    .lean();

  const role = (session.user as { role?: string }).role ?? "student";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-slate-600 dark:text-slate-400">
            Welcome, {session.user?.name ?? session.user?.email}.
            <Badge variant="primary">{role}</Badge>
          </p>
        </div>
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
            My enrollments
          </h2>
          {enrollments.length === 0 ? (
            <Card className="border-dashed border-slate-300 dark:border-slate-600">
              <p className="text-center text-slate-600 dark:text-slate-400">
                You are not enrolled in any course yet.{" "}
                <Link
                  href="/courses"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Browse courses
                </Link>
              </p>
            </Card>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2">
              {enrollments.map(
                (e: {
                  _id: string;
                  courseId:
                    | { _id?: unknown; title?: string; description?: string }
                    | unknown;
                  progress: number;
                }) => (
                  <li key={String(e._id)}>
                    <Link
                      href={`/courses/${String(
                        typeof e.courseId === "object" &&
                          e.courseId &&
                          "_id" in e.courseId
                          ? (e.courseId as { _id: unknown })._id
                          : e.courseId
                      )}`}
                    >
                      <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50">
                        <CardTitle>
                          {typeof e.courseId === "object" &&
                          e.courseId &&
                          "title" in e.courseId
                            ? (e.courseId as { title: string }).title
                            : "Course"}
                        </CardTitle>
                        <CardDescription>
                          {typeof e.courseId === "object" &&
                          e.courseId &&
                          "description" in e.courseId
                            ? String(
                                (e.courseId as { description?: string })
                                  .description ?? ""
                              )
                            : ""}
                        </CardDescription>
                        <div className="mt-4">
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              Progress
                            </span>
                            <span className="text-slate-600 dark:text-slate-400">
                              {e.progress}%
                            </span>
                          </div>
                          <ProgressBar value={e.progress} />
                        </div>
                      </Card>
                    </Link>
                  </li>
                )
              )}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
