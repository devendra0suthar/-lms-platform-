import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB, { isConnectionError } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "Email and password are required", code: "missing_fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: "User not registered. Please sign up first.", code: "user_not_found" },
        { status: 404 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { error: "Invalid account configuration", code: "no_password" },
        { status: 400 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Incorrect password", code: "invalid_password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (e) {
    if (isConnectionError(e)) {
      return NextResponse.json(
        {
          error: "Database unavailable. Please try again later.",
          code: "db_error",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Login failed", code: "unknown_error" },
      { status: 500 }
    );
  }
}
