import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB, { isConnectionError } from "@/lib/db";
import Certificate from "@/models/Certificate";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import crypto from "crypto";

// GET - Get certificate for a course
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    await connectDB();

    const certificate = await Certificate.findOne({
      userId: session.user.id,
      courseId,
    }).lean();

    if (!certificate) {
      return NextResponse.json({ certificate: null });
    }

    return NextResponse.json({
      certificate: {
        _id: String(certificate._id),
        certificateId: certificate.certificateId,
        userName: certificate.userName,
        courseName: certificate.courseName,
        completedAt: certificate.completedAt,
      },
    });
  } catch (e) {
    if (isConnectionError(e)) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    return NextResponse.json({ error: "Failed to fetch certificate" }, { status: 500 });
  }
}

// POST - Generate certificate (when course is 100% complete)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    await connectDB();

    // Check enrollment and progress
    const enrollment = await Enrollment.findOne({
      userId: session.user.id,
      courseId,
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 });
    }

    if (enrollment.progress < 100) {
      return NextResponse.json({ error: "Course not completed yet" }, { status: 400 });
    }

    // Check if certificate already exists
    const existing = await Certificate.findOne({
      userId: session.user.id,
      courseId,
    });

    if (existing) {
      return NextResponse.json({
        certificate: {
          _id: String(existing._id),
          certificateId: existing.certificateId,
          userName: existing.userName,
          courseName: existing.courseName,
          completedAt: existing.completedAt,
        },
      });
    }

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Generate unique certificate ID
    const certificateId = `CERT-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;

    // Create certificate
    const certificate = await Certificate.create({
      userId: session.user.id,
      courseId,
      userName: session.user.name ?? session.user.email ?? "Student",
      courseName: course.title,
      certificateId,
    });

    return NextResponse.json({
      certificate: {
        _id: String(certificate._id),
        certificateId: certificate.certificateId,
        userName: certificate.userName,
        courseName: certificate.courseName,
        completedAt: certificate.completedAt,
      },
    });
  } catch (e) {
    if (isConnectionError(e)) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 });
  }
}
