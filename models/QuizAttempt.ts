import mongoose from "mongoose";

const QuizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  answers: [{ type: Number }], // index of selected option for each question
  score: { type: Number, required: true }, // percentage score
  passed: { type: Boolean, required: true },
}, { timestamps: true });

QuizAttemptSchema.index({ userId: 1, quizId: 1 });

export default mongoose.models.QuizAttempt || mongoose.model("QuizAttempt", QuizAttemptSchema);
