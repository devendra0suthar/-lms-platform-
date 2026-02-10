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
  description: String,
  questions: [{ question: String, options: [String], correctAnswer: Number }],
  passingScore: { type: Number, default: 70 },
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

    const course = await Course.findOne({ title: "UI/UX Design Fundamentals" });
    if (!course) {
      console.log("Course 'UI/UX Design Fundamentals' not found in database.");
      process.exit(0);
    }

    await Quiz.deleteMany({ courseId: course._id });
    await Enrollment.deleteMany({ courseId: course._id });
    await Course.findByIdAndDelete(course._id);

    console.log("Deleted 'UI/UX Design Fundamentals' course, its quiz, and enrollments.");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
