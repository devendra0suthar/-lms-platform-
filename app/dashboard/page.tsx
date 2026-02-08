import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import User from "@/models/User";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  await connectDB();
  const role = (session.user as { role?: string }).role ?? "student";

  // Get time of day for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (role === "admin") {
    const allCourses = await Course.find()
      .populate("instructor", "name email")
      .lean();
    const allEnrollments = await Enrollment.find({})
      .populate("userId", "name email")
      .populate("courseId", "title description lessons")
      .lean();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalCourses = allCourses.length;

    return (
      <AdminDashboard
        session={session}
        greeting={greeting}
        role={role}
        allCourses={JSON.parse(JSON.stringify(allCourses))}
        allEnrollments={JSON.parse(JSON.stringify(allEnrollments))}
        totalStudents={totalStudents}
        totalCourses={totalCourses}
      />
    );
  }

  // Student / Instructor dashboard
  const enrollments = await Enrollment.find({ userId: session.user.id })
    .populate("courseId", "title description lessons")
    .lean();
  const totalCourses = await Course.countDocuments();
  const completedCourses = enrollments.filter((e) => e.progress === 100).length;
  const inProgressCourses = enrollments.filter((e) => e.progress > 0 && e.progress < 100).length;

  return (
    <StudentDashboard
      session={session}
      greeting={greeting}
      role={role}
      enrollments={JSON.parse(JSON.stringify(enrollments))}
      totalCourses={totalCourses}
      completedCourses={completedCourses}
      inProgressCourses={inProgressCourses}
    />
  );
}
