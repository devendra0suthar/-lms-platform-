# Testing with Crusher

Crusher helps you automate E2E testing for the LMS. Run tests on every change to keep the project industry-ready.

## What to test

- **Login flow** – Sign in with credentials, redirect to dashboard
- **Course creation** – Instructor creates a course (if you add an instructor UI)
- **Enrollment** – Student enrolls in a course
- **Video playback** – Lesson video loads and plays (Cloudinary or embed)
- **Dashboard loading** – Dashboard shows enrolled courses and progress

## Steps to set up Crusher

1. **Open Crusher** – Go to [crusher.dev](https://crusher.dev) and sign in (or install the Crusher app).

2. **Create a project** – Link this repo or your deployed URL (e.g. `https://your-app.vercel.app`).

3. **Record a user flow**
   - Start recording.
   - **Login**: Go to `/login` → enter email/password → submit → confirm redirect to `/dashboard`.
   - **Courses**: Go to `/courses` → open a course → click “Enroll” (if not enrolled).
   - **Lesson**: Open a lesson with a video → confirm video area is visible (and plays if you add play assertion).
   - **Dashboard**: Go to `/dashboard` → confirm enrolled courses and progress show.

4. **Add assertions**
   - After login: assert URL is `/dashboard` or page contains “Dashboard”.
   - On course page: assert “Enroll” or “Your progress” is visible.
   - On dashboard: assert at least one course card or “My enrollments” section.

5. **Run on every change**
   - Connect Crusher to your Git (e.g. GitHub) and run the test suite on push or PR.
   - Use Crusher’s scheduled runs for periodic checks.

## Local testing

- Run the app: `npm run dev` (e.g. `http://localhost:3000`).
- Point Crusher at `http://localhost:3000` for local runs, or use a deployed preview URL for CI.

## Test data

- Ensure you have at least one user (student), one instructor (for course creation tests if applicable), and one course with at least one lesson (with or without video) so recorded flows are stable.
