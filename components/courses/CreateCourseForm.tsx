"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Lesson = {
  title: string;
  videoUrl: string;
};

export function CreateCourseForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([{ title: "", videoUrl: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function addLesson() {
    setLessons([...lessons, { title: "", videoUrl: "" }]);
  }

  function removeLesson(index: number) {
    if (lessons.length > 1) {
      setLessons(lessons.filter((_, i) => i !== index));
    }
  }

  function updateLesson(index: number, field: keyof Lesson, value: string) {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Filter out empty lessons
    const validLessons = lessons.filter((l) => l.title.trim());

    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        lessons: validLessons,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to create course");
      return;
    }

    router.push(`/courses/${data._id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Course Details */}
      <Card>
        <h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
          Course Details
        </h2>
        <div className="space-y-5">
          <Input
            label="Course Title"
            type="text"
            placeholder="e.g., Introduction to Web Development"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
              rows={4}
              placeholder="Describe what students will learn in this course..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </div>
      </Card>

      {/* Lessons */}
      <Card>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Lessons
          </h2>
          <Button type="button" variant="outline" size="sm" onClick={addLesson}>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Lesson
          </Button>
        </div>

        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <div
              key={index}
              className="relative rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-sm font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                  {index + 1}
                </span>
                {lessons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLesson(index)}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Lesson Title"
                  type="text"
                  placeholder="e.g., Getting Started"
                  value={lesson.title}
                  onChange={(e) => updateLesson(index, "title", e.target.value)}
                />
                <Input
                  label="Video URL (optional)"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={lesson.videoUrl}
                  onChange={(e) => updateLesson(index, "videoUrl", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        {lessons.length === 0 && (
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            No lessons added yet. Click "Add Lesson" to get started.
          </p>
        )}
      </Card>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Course
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
