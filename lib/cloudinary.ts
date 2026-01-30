import cloudinary from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export type ResourceType = "image" | "video" | "raw";

export async function uploadFile(
  buffer: Buffer,
  options: {
    resourceType?: ResourceType;
    folder?: string;
    publicId?: string;
  } = {}
): Promise<{ url: string; secureUrl: string; publicId: string }> {
  const { resourceType = "video", folder = "lms", publicId } = options;
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder,
        ...(publicId && { public_id: publicId }),
      },
      (err: Error | undefined, result: { secure_url?: string; public_id?: string } | undefined) => {
        if (err) return reject(err);
        if (!result?.secure_url) return reject(new Error("Upload failed"));
        resolve({
          url: result.secure_url,
          secureUrl: result.secure_url,
          publicId: result.public_id ?? "",
        });
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}
