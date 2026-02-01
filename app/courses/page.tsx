import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB, { isConnectionError } from "@/lib/db";
import Course from "@/models/Course";
import { CoursesPage } from "@/components/courses/CoursesPage";
import type { CourseCardItem } from "@/components/courses/CourseCard";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  try {
    await connectDB();
    const rawCourses = await Course.find()
      .populate("instructor", "name email")
      .lean();

    // Serialize MongoDB documents for Client Component
    const courses: CourseCardItem[] = JSON.parse(JSON.stringify(rawCourses.map((course) => ({
      _id: String(course._id),
      title: course.title,
      description: course.description,
      lessons: Array.isArray(course.lessons)
        ? course.lessons.map((l: { title?: string; videoUrl?: string }) => ({
            title: l.title,
            videoUrl: l.videoUrl
          }))
        : [],
      instructor: course.instructor ? {
        name: (course.instructor as { name?: string }).name,
      } : undefined,
    }))));

    return <CoursesPage courses={courses} />;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const name = e instanceof Error ? e.name : "";
    console.error("[courses page]", name, message);
    if (isConnectionError(e)) {
      return <CoursesPage dbUnavailable errorMessage={message} />;
    }
    throw e;
  }
}
