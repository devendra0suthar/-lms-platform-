"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";

type AddLessonFormProps = {
  courseId: string;
};

export function AddLessonForm({ courseId }: AddLessonFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Lesson title is required");
      return;
    }
    setLoading(true);
    try {
      let videoUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "video");
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          setError(uploadData.error ?? "Upload failed");
          setLoading(false);
          return;
        }
        videoUrl = uploadData.url;
      }
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson: { title: title.trim(), videoUrl },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to add lesson");
        setLoading(false);
        return;
      }
      setTitle("");
      setFile(null);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mt-8 border-slate-200/80 dark:border-slate-700">
      <CardTitle>Add lesson</CardTitle>
      <CardDescription>
        Upload a video (Cloudinary) or leave empty and add a URL later.
      </CardDescription>
      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <Input
          label="Lesson title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Introduction"
          required
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Video file (optional)
          </label>
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-indigo-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:file:bg-indigo-950/50 dark:file:text-indigo-300"
          />
        </div>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </p>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Adding…" : "Add lesson"}
        </Button>
      </form>
    </Card>
  );
}
