import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB, { isConnectionError } from "@/lib/db";
import User from "@/models/User";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can edit other users
    await connectDB();
    const adminUser = await User.findById(session.user.id).select("role").lean();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        _id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    if (isConnectionError(e)) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
    console.error("User update error:", e);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
