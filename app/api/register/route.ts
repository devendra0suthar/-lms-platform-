import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB, { isConnectionError } from "@/lib/db";
import User from "@/models/User";

function isPasswordStrong(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: "Password must contain at least one special character" };
  }
  return { valid: true, message: "" };
}

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();
    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const passwordCheck = isPasswordStrong(password);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { error: passwordCheck.message },
        { status: 400 }
      );
    }

    await connectDB();
    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashed,
      role: role === "instructor" || role === "admin" ? role : "student",
    });
    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (e) {
    if (isConnectionError(e)) {
      return NextResponse.json(
        {
          error:
            "Database unavailable. Add your IP to MongoDB Atlas → Network Access and try again.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Registration failed" },
      { status: 500 }
    );
  }
}
