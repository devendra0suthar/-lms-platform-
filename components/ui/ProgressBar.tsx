type ProgressBarProps = {
  value: number; // 0–100
  className?: string;
  variant?: "default" | "light";
};

export function ProgressBar({ value, className = "", variant = "default" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const isComplete = clamped === 100;

  const bgColors = {
    default: "bg-slate-200 dark:bg-slate-700",
    light: "bg-white/20",
  };

  const fillColors = {
    default: isComplete
      ? "bg-emerald-500 dark:bg-emerald-400"
      : "bg-indigo-600 dark:bg-indigo-500",
    light: isComplete
      ? "bg-emerald-400"
      : "bg-white",
  };

  return (
    <div
      className={`h-2.5 w-full overflow-hidden rounded-full ${bgColors[variant]} ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${fillColors[variant]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
