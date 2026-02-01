import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB, { isConnectionError } from "@/lib/db";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
import Certificate from "@/models/Certificate";
import Course from "@/models/Course";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Fetch user details
    const user = await User.findById(session.user.id).select("-password").lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch enrollments with course details
    const enrollments = await Enrollment.find({ userId: session.user.id })
      .populate("courseId", "title description lessons")
      .lean();

    // Fetch certificates
    const certificates = await Certificate.find({ userId: session.user.id }).lean();

    // Fetch courses created by user (if instructor)
    const createdCourses = await Course.find({ instructor: session.user.id })
      .select("title description lessons")
      .lean();

    // Calculate stats
    const totalEnrolled = enrollments.length;
    const completedCourses = enrollments.filter((e) => e.progress === 100).length;
    const inProgressCourses = enrollments.filter((e) => e.progress > 0 && e.progress < 100).length;
    const totalCertificates = certificates.length;

    // Calculate total lessons completed
    const totalLessonsCompleted = enrollments.reduce(
      (sum, e) => sum + (e.completedLessons?.length ?? 0),
      0
    );

    // Format enrollments for response
    const formattedEnrollments = enrollments.map((e) => {
      const course = e.courseId as {
        _id: unknown;
        title?: string;
        description?: string;
        lessons?: { title?: string }[];
      };
      return {
        _id: String(e._id),
        courseId: String(course._id),
        courseTitle: course.title ?? "Untitled",
        courseDescription: course.description ?? "",
        totalLessons: course.lessons?.length ?? 0,
        completedLessons: e.completedLessons?.length ?? 0,
        progress: e.progress,
      };
    });

    // Format certificates
    const formattedCertificates = certificates.map((c) => ({
      _id: String(c._id),
      certificateId: c.certificateId,
      courseName: c.courseName,
      completedAt: c.completedAt,
    }));

    // Format created courses
    const formattedCreatedCourses = createdCourses.map((c) => ({
      _id: String(c._id),
      title: c.title,
      description: c.description,
      lessonsCount: c.lessons?.length ?? 0,
    }));

    return NextResponse.json({
      user: {
        _id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      stats: {
        totalEnrolled,
        completedCourses,
        inProgressCourses,
        totalCertificates,
        totalLessonsCompleted,
        coursesCreated: createdCourses.length,
      },
      enrollments: formattedEnrollments,
      certificates: formattedCertificates,
      createdCourses: formattedCreatedCourses,
    });
  } catch (e) {
    if (isConnectionError(e)) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    console.error("Profile fetch error:", e);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
