/**
 * Seed a test course into the database.
 * Run: node --env-file=.env.local scripts/seed-course.mjs
 */

import mongoose from "mongoose";

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI is not set");
  process.exit(1);
}

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lessons: [{ title: String, videoUrl: String }],
});

const Course = mongoose.model("Course", CourseSchema);

const testCourse = {
  title: "Introduction to Web Development",
  description: "Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.",
  lessons: [
    { title: "Getting Started with HTML", videoUrl: "https://example.com/lesson1" },
    { title: "Styling with CSS", videoUrl: "https://example.com/lesson2" },
    { title: "JavaScript Basics", videoUrl: "https://example.com/lesson3" },
    { title: "Building Your First Website", videoUrl: "https://example.com/lesson4" },
  ],
};

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log("Connected to MongoDB");

  const course = await Course.create(testCourse);
  console.log("Test course created:");
  console.log(`  ID: ${course._id}`);
  console.log(`  Title: ${course.title}`);
  console.log(`  Lessons: ${course.lessons.length}`);

  await mongoose.disconnect();
  process.exit(0);
} catch (e) {
  console.error("Error:", e.message);
  process.exit(1);
}
