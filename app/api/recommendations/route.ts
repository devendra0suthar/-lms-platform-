import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB, { isConnectionError } from "@/lib/db";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get user's enrollments
    const enrollments = await Enrollment.find({ userId: session.user.id }).lean();
    const enrolledCourseIds = enrollments.map((e) => String(e.courseId));

    // Get all courses
    const allCourses = await Course.find()
      .populate("instructor", "name")
      .lean();

    // Get enrolled courses details for context
    const enrolledCourses = allCourses.filter((c) =>
      enrolledCourseIds.includes(String(c._id))
    );

    // Get courses not enrolled
    const availableCourses = allCourses.filter(
      (c) => !enrolledCourseIds.includes(String(c._id))
    );

    if (availableCourses.length === 0) {
      return NextResponse.json({
        recommendations: [],
        message: "You're enrolled in all available courses!",
      });
    }

    // If no OpenAI key, use simple recommendation logic
    if (!OPENAI_API_KEY) {
      // Simple recommendation: return courses not enrolled, sorted by number of lessons
      const simpleRecommendations = availableCourses
        .sort((a, b) => (b.lessons?.length || 0) - (a.lessons?.length || 0))
        .slice(0, 3)
        .map((course) => ({
          _id: String(course._id),
          title: course.title,
          description: course.description,
          lessonsCount: course.lessons?.length || 0,
          instructor: (course.instructor as { name?: string })?.name || "Unknown",
          reason: "Popular course you haven't taken yet",
        }));

      return NextResponse.json({ recommendations: simpleRecommendations });
    }

    // Use AI to generate personalized recommendations
    const enrolledCourseTitles = enrolledCourses.map((c) => c.title).join(", ");
    const availableCoursesInfo = availableCourses.map((c) => ({
      id: String(c._id),
      title: c.title,
      description: c.description,
    }));

    const prompt = `You are a course recommendation system. Based on the user's enrolled courses, recommend the best courses for them to take next.

User's enrolled courses: ${enrolledCourseTitles || "None yet"}

Available courses:
${availableCoursesInfo.map((c) => `- ID: ${c.id}, Title: "${c.title}", Description: "${c.description}"`).join("\n")}

Return a JSON array of exactly 3 recommended course IDs with reasons. Format:
[{"id": "course_id", "reason": "brief personalized reason"}]

Only return the JSON array, nothing else.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      // Fallback to simple recommendations
      const fallbackRecs = availableCourses.slice(0, 3).map((course) => ({
        _id: String(course._id),
        title: course.title,
        description: course.description,
        lessonsCount: course.lessons?.length || 0,
        instructor: (course.instructor as { name?: string })?.name || "Unknown",
        reason: "Recommended for you",
      }));
      return NextResponse.json({ recommendations: fallbackRecs });
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "[]";

    let aiRecommendations: { id: string; reason: string }[] = [];
    try {
      aiRecommendations = JSON.parse(aiResponse);
    } catch {
      // If parsing fails, use simple recommendations
      const fallbackRecs = availableCourses.slice(0, 3).map((course) => ({
        _id: String(course._id),
        title: course.title,
        description: course.description,
        lessonsCount: course.lessons?.length || 0,
        instructor: (course.instructor as { name?: string })?.name || "Unknown",
        reason: "Recommended for you",
      }));
      return NextResponse.json({ recommendations: fallbackRecs });
    }

    // Map AI recommendations to course data
    const recommendations = aiRecommendations
      .map((rec) => {
        const course = availableCourses.find((c) => String(c._id) === rec.id);
        if (!course) return null;
        return {
          _id: String(course._id),
          title: course.title,
          description: course.description,
          lessonsCount: course.lessons?.length || 0,
          instructor: (course.instructor as { name?: string })?.name || "Unknown",
          reason: rec.reason,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ recommendations });
  } catch (e) {
    if (isConnectionError(e)) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    console.error("Recommendations error:", e);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
