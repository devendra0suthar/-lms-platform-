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

async function check() {
  await mongoose.connect(MONGO_URI as string);
  const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);

  const courses = await Course.find().lean();

  console.log(`\nTotal courses: ${courses.length}\n`);

  const withContent: string[] = [];
  const withoutContent: string[] = [];

  for (const c of courses) {
    const lessons = (c as any).lessons || [];
    const hasVideo = lessons.some((l: any) => l.videoUrl && l.videoUrl.trim() !== "");
    const status = hasVideo ? "HAS CONTENT" : "NO CONTENT";

    if (hasVideo) {
      withContent.push((c as any).title);
    } else {
      withoutContent.push((c as any).title);
    }

    console.log(`[${status}] ${(c as any).title} — ${lessons.length} lessons, ${lessons.filter((l: any) => l.videoUrl && l.videoUrl.trim() !== "").length} with video`);
  }

  console.log(`\n--- Summary ---`);
  console.log(`Courses WITH content: ${withContent.length}`);
  console.log(`Courses WITHOUT content: ${withoutContent.length}`);

  if (withoutContent.length > 0) {
    console.log(`\nWill be removed:`);
    withoutContent.forEach(t => console.log(`  - ${t}`));
  }

  await mongoose.disconnect();
}

check().catch((err) => { console.error(err); process.exit(1); });
