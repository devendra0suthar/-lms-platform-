import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error("MONGO_URI not set"); process.exit(1); }

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lessons: [{ title: String, videoUrl: String }],
}, { timestamps: true });

const EnrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  progress: { type: Number, default: 0 },
  completedLessons: [{ type: Number }],
}, { timestamps: true });

async function removeEmpty() {
  await mongoose.connect(MONGO_URI as string);
  const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
  const Enrollment = mongoose.models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema);

  const courses = await Course.find().lean();
  let removed = 0;

  for (const c of courses) {
    const lessons = (c as any).lessons || [];
    const hasVideo = lessons.some((l: any) => l.videoUrl && l.videoUrl.trim() !== "");

    if (!hasVideo) {
      await Course.findByIdAndDelete((c as any)._id);
      await Enrollment.deleteMany({ courseId: (c as any)._id });
      console.log(`  Removed: ${(c as any).title}`);
      removed++;
    }
  }

  console.log(`\nDone. Removed ${removed} courses without content.`);
  await mongoose.disconnect();
}

removeEmpty().catch((err) => { console.error(err); process.exit(1); });
