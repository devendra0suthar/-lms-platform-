import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  userName: { type: String, required: true },
  courseName: { type: String, required: true },
  completedAt: { type: Date, default: Date.now },
  certificateId: { type: String, required: true, unique: true },
}, { timestamps: true });

CertificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.Certificate || mongoose.model("Certificate", CertificateSchema);
