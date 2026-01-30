import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFile } from "@/lib/cloudinary";

const MAX_SIZE = 100 * 1024 * 1024; // 100 MB
const ALLOWED_VIDEO = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = (session.user as { role?: string }).role;
    if (role !== "instructor" && role !== "admin") {
      return NextResponse.json(
        { error: "Instructor or admin only" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "video";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 100 MB)" },
        { status: 400 }
      );
    }

    const resourceType = type === "image" ? "image" : "video";
    const allowed =
      resourceType === "video"
        ? ALLOWED_VIDEO
        : ALLOWED_IMAGE;
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${allowed.join(", ")}` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadFile(buffer, {
      resourceType,
      folder: "lms",
    });

    return NextResponse.json({
      url: result.secureUrl,
      publicId: result.publicId,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 500 }
    );
  }
}
