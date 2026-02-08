import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Parse .env.local manually
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
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not set in .env.local");
  process.exit(1);
}

async function seedAdmin() {
  await mongoose.connect(MONGO_URI as string);

  // Define schema inline to avoid path alias issues
  const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["student", "instructor", "admin"], default: "student" },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  const email = "admin@test.com";
  const password = "Admin@123";
  const name = "Test Admin";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`User "${email}" already exists (role: ${existing.role}). Updating role to admin...`);
    existing.role = "admin";
    await existing.save();
    console.log("Role updated to admin.");
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });
    console.log(`Admin user created: ${email} / ${password}`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

seedAdmin().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
