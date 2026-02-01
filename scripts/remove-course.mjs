import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lessons: [{ title: String, videoUrl: String }],
}, { timestamps: true });

const QuizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  title: String,
});

const EnrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});

const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
const Enrollment = mongoose.models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema);

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Find courses with "Web Development" or "Introduction" in title
    const courses = await Course.find({
      title: { $regex: /introduction to web development|^web development$/i }
    });

    if (courses.length === 0) {
      console.log("No matching courses found.");

      // List all courses
      const allCourses = await Course.find().select("title");
      console.log("\nAll courses:");
      allCourses.forEach((c, i) => console.log(`${i + 1}. ${c.title}`));
    } else {
      for (const course of courses) {
        console.log(`Deleting course: ${course.title}`);

        // Delete associated quiz
        await Quiz.deleteMany({ courseId: course._id });
        console.log("  - Deleted associated quizzes");

        // Delete enrollments
        await Enrollment.deleteMany({ courseId: course._id });
        console.log("  - Deleted associated enrollments");

        // Delete course
        await Course.deleteOne({ _id: course._id });
        console.log("  - Course deleted");
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
