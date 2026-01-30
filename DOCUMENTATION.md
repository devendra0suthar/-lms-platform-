# LMS Platform – Project documentation

Documentation for project submission: tech stack, architecture, features, testing, and screenshots.

---

## 1. Tech stack

| Layer        | Technology |
|-------------|------------|
| Framework   | Next.js 16 (App Router) |
| Language    | TypeScript |
| Auth       | NextAuth.js (Credentials provider, JWT session) |
| Database   | MongoDB (MongoDB Atlas) |
| ODM        | Mongoose |
| Styling    | Tailwind CSS |
| Video/Files| Cloudinary (upload + stream) |
| Deployment | Vercel (frontend + API) |

---

## 2. Architecture (high-level)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                          │
│  Next.js React (Server + Client Components), Tailwind CSS       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js App (Vercel)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Pages (RSC)  │  │ API Routes   │  │ Auth [...nextauth]   │  │
│  │ /, /login,   │  │ /api/register│  │ Credentials, JWT      │  │
│  │ /courses,    │  │ /api/courses │  │ Session + role        │  │
│  │ /dashboard   │  │ /api/upload  │  └──────────────────────┘  │
│  └──────────────┘  │ /api/enroll  │                             │
│                    │ /api/progress│                             │
│                    └──────┬───────┘                             │
└───────────────────────────┼────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌───────────────┐ ┌─────────────────┐
│ MongoDB Atlas   │ │ Cloudinary    │ │ NextAuth        │
│ (Users, Courses,│ │ (Video/Image  │ │ (Session store  │
│  Enrollments)   │ │  upload + URL) │ │  in JWT)        │
└─────────────────┘ └───────────────┘ └─────────────────┘
```

**Data flow (examples):**

- **Login**: Client → NextAuth Credentials → Mongoose User lookup + bcrypt → JWT with role → session.
- **Video**: Instructor uploads file → `/api/upload` → Cloudinary → URL saved in Course.lessons[].videoUrl → Course page streams via `<video>` (Cloudinary) or iframe (embeds).

---

## 3. Features list

- **Auth**: Register, login (email/password), role-based access (student, instructor, admin), session handling.
- **Courses**: List courses, view course detail, create course (instructor/admin via API).
- **Lessons**: Add lesson with optional video upload (Cloudinary); store video URL in MongoDB; stream on course page (Cloudinary URL in `<video>`, other URLs in iframe).
- **Enrollment**: Enroll in a course (student), prevent duplicate enrollment.
- **Progress**: Track progress per course (0–100%), mark lessons complete, persist in Enrollment.
- **Dashboard**: Show enrolled courses and progress for the logged-in user.
- **Video & file upload**: Cloudinary integration for video (and optional image) upload; URLs stored in MongoDB and used for playback.

---

## 4. Screenshots

For submission, add screenshots in a `/docs` or `/screenshots` folder (or embed in this doc), for example:

1. **Home** – Landing with links to Courses, Login, Register.
2. **Login** – Login form.
3. **Courses** – Course list.
4. **Course detail** – Course with lessons and video player (and “Add lesson” for instructors).
5. **Dashboard** – Enrolled courses and progress.

Suggested filenames: `01-home.png`, `02-login.png`, `03-courses.png`, `04-course-detail.png`, `05-dashboard.png`.

---

## 5. Testing (Crusher)

- **Tool**: Crusher for E2E automation.
- **Scenarios**: Login flow, course list, enrollment, video/lesson view, dashboard loading.
- **Steps**: See [TESTING.md](./TESTING.md) for opening Crusher, recording flows (login → course → lesson), adding assertions, and running on every change.

This makes the project ready for repeatable, automated testing.

---

## 6. Deployment

- **Host**: Vercel (frontend + API).
- **Database**: MongoDB Atlas (production).
- **Env vars**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for the list and how to set them in the Vercel dashboard.
