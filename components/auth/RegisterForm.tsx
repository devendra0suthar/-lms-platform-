"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";

function getPasswordStrength(password: string) {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  if (checks.length) score++;
  if (checks.uppercase) score++;
  if (checks.lowercase) score++;
  if (checks.number) score++;
  if (checks.special) score++;

  let label = "Very Weak";
  let color = "bg-red-500";
  if (score >= 5) {
    label = "Strong";
    color = "bg-green-500";
  } else if (score >= 4) {
    label = "Good";
    color = "bg-blue-500";
  } else if (score >= 3) {
    label = "Fair";
    color = "bg-yellow-500";
  } else if (score >= 2) {
    label = "Weak";
    color = "bg-orange-500";
  }

  return { score, label, color, checks };
}

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordsMatch = password === confirmPassword;
  const isPasswordStrong = passwordStrength.score >= 4;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    if (!isPasswordStrong) {
      setError("Please use a stronger password");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Registration failed");
      return;
    }
    router.push("/login?registered=1");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md border-slate-200/80 shadow-xl dark:border-slate-700">
      <CardTitle>Create an account</CardTitle>
      <CardDescription>Register with email and password.</CardDescription>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <Input
          label="Name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div>
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {password && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength.score >= 4 ? "text-green-600 dark:text-green-400" :
                  passwordStrength.score >= 3 ? "text-yellow-600 dark:text-yellow-400" :
                  "text-red-600 dark:text-red-400"
                }`}>
                  {passwordStrength.label}
                </span>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <li className={passwordStrength.checks.length ? "text-green-600 dark:text-green-400" : ""}>
                  {passwordStrength.checks.length ? "✓" : "○"} At least 8 characters
                </li>
                <li className={passwordStrength.checks.uppercase ? "text-green-600 dark:text-green-400" : ""}>
                  {passwordStrength.checks.uppercase ? "✓" : "○"} One uppercase letter
                </li>
                <li className={passwordStrength.checks.lowercase ? "text-green-600 dark:text-green-400" : ""}>
                  {passwordStrength.checks.lowercase ? "✓" : "○"} One lowercase letter
                </li>
                <li className={passwordStrength.checks.number ? "text-green-600 dark:text-green-400" : ""}>
                  {passwordStrength.checks.number ? "✓" : "○"} One number
                </li>
                <li className={passwordStrength.checks.special ? "text-green-600 dark:text-green-400" : ""}>
                  {passwordStrength.checks.special ? "✓" : "○"} One special character
                </li>
              </ul>
            </div>
          )}
        </div>
        <div>
          <Input
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {confirmPassword && (
            <p className={`mt-1 text-xs ${
              passwordsMatch
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}>
              {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
            </p>
          )}
        </div>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </p>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={loading || !passwordsMatch || !isPasswordStrong}
        >
          {loading ? "Creating account…" : "Register"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Sign in
        </Link>
      </p>
    </Card>
  );
}
