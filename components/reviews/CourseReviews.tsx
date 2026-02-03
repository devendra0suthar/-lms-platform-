"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type Review = {
  _id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: { name: string };
};

function StarRating({ rating, onRate, interactive = false }: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <svg
            className={`h-6 w-6 transition-colors ${
              star <= (hover || rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-slate-300 dark:text-slate-600'
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export function CourseReviews({ courseId, isEnrolled, isCompleted = false }: { courseId: string; isEnrolled: boolean; isCompleted?: boolean }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  async function fetchReviews() {
    const res = await fetch(`/api/reviews?courseId=${courseId}`);
    const data = await res.json();
    if (res.ok) {
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setTotalReviews(data.totalReviews);
    }
    setLoading(false);
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitting(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, rating, comment }),
    });
    setSubmitting(false);

    if (res.ok) {
      setShowForm(false);
      setRating(0);
      setComment("");
      fetchReviews();
    }
  }

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-20 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Course Reviews
            </h3>
            <div className="mt-2 flex items-center gap-3">
              <StarRating rating={Math.round(averageRating)} />
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-slate-500">({totalReviews} reviews)</span>
            </div>
          </div>
          {isEnrolled && isCompleted && !showForm && (
            <Button onClick={() => setShowForm(true)}>
              Write a Review
            </Button>
          )}
        </div>

        {/* Review Form */}
        {showForm && (
          <form onSubmit={submitReview} className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Your Rating
              </label>
              <StarRating rating={rating} onRate={setRating} interactive />
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Your Review (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Share your experience with this course..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={rating === 0 || submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review._id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                    {review.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {review.user.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} />
                      <span className="text-sm text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {review.comment && (
                <p className="mt-3 text-slate-600 dark:text-slate-400">
                  {review.comment}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      {reviews.length === 0 && !showForm && (
        <Card className="border-dashed">
          <p className="text-center text-slate-500">
            No reviews yet. {isCompleted ? "Be the first to review!" : isEnrolled ? "Complete the course to leave a review." : "Enroll and complete the course to leave a review."}
          </p>
        </Card>
      )}
    </div>
  );
}
