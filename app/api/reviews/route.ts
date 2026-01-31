import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB, { isConnectionError } from "@/lib/db";
import Review from "@/models/Review";
import Enrollment from "@/models/Enrollment";

// GET - Fetch reviews for a course
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    await connectDB();
    const reviews = await Review.find({ courseId })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .lean();

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    const serializedReviews = reviews.map((r) => ({
      _id: String(r._id),
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      user: {
        name: (r.userId as { name?: string })?.name ?? "Anonymous",
      },
    }));

    return NextResponse.json({
      reviews: serializedReviews,
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
    });
  } catch (e) {
    if (isConnectionError(e)) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST - Create/update review
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, rating, comment } = await request.json();

    if (!courseId || !rating) {
      return NextResponse.json({ error: "courseId and rating are required" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    await connectDB();

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({ userId: session.user.id, courseId });
    if (!enrollment) {
      return NextResponse.json({ error: "You must be enrolled to review this course" }, { status: 403 });
    }

    // Upsert review
    const review = await Review.findOneAndUpdate(
      { userId: session.user.id, courseId },
      { rating, comment },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json(review);
  } catch (e) {
    if (isConnectionError(e)) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
