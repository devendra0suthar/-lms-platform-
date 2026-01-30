import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    default: "student",
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
