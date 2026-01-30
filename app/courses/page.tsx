import connectDB, { isConnectionError } from "@/lib/db";
import Course from "@/models/Course";
import { CoursesPage } from "@/components/courses/CoursesPage";
import type { CourseCardItem } from "@/components/courses/CourseCard";

export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    await connectDB();
    const courses = (await Course.find()
      .populate("instructor", "name email")
      .lean()) as CourseCardItem[];
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
