import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-900" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.08),transparent)]" />
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="primary" className="mb-6">
          Learning platform
        </Badge>
        <h1 className="mb-5 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Learn with{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            structured courses
          </span>
        </h1>
        <p className="mb-12 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          Register, enroll in courses, and track your progress. Stream videos and
          mark lessons complete.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/courses">
            <Button size="lg">Browse courses</Button>
          </Link>
          {!session && (
            <>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary" size="lg">
                  Get started
                </Button>
              </Link>
            </>
          )}
          {session && (
            <Link href="/dashboard">
              <Button variant="outline" size="lg">
                Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
