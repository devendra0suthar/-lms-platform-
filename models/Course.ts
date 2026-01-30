import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lessons: [
    {
      title: String,
      videoUrl: String,
    },
  ],
});

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
