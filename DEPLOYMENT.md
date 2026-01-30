# Deployment

## Frontend + Backend (Vercel)

The app is a single Next.js project (frontend + API routes). Deploy to Vercel:

1. **Push to GitHub** (or connect your Git provider to Vercel).

2. **Import project in Vercel**
   - [vercel.com/new](https://vercel.com/new) → Import the `lms-platform` (or repo containing it).
   - Root directory: set to `lms-platform` if the repo root is the parent folder.

3. **Add environment variables** in Vercel (Project → Settings → Environment Variables):

   | Variable              | Description                    | Example / Note                          |
   |-----------------------|--------------------------------|----------------------------------------|
   | `MONGO_URI`           | MongoDB Atlas connection string| `mongodb+srv://user:pass@cluster.../lms`|
   | `NEXTAUTH_SECRET`     | NextAuth secret                | Generate: `openssl rand -base64 32`    |
   | `NEXTAUTH_URL`        | App URL                        | `https://your-app.vercel.app`           |
   | `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name        | From Cloudinary dashboard               |
   | `CLOUDINARY_API_KEY`  | Cloudinary API key             | From Cloudinary dashboard               |
   | `CLOUDINARY_API_SECRET` | Cloudinary API secret       | From Cloudinary dashboard               |

4. **Deploy** – Vercel builds and deploys. Use the default build command (`next build`) and output (Next.js).

5. **Production URL** – After deploy, set `NEXTAUTH_URL` to your production URL (e.g. `https://your-app.vercel.app`) if not already set.

## Database (MongoDB Atlas)

- Use **MongoDB Atlas** (already configured via `MONGO_URI`).
- Ensure the Atlas cluster is running and the connection string in Vercel is correct.
- For production, restrict Atlas network access to your Vercel IPs or use “Allow access from anywhere” only if acceptable for your use case.

## Post-deploy checks

- Visit `https://your-app.vercel.app` and test:
  - Register → Login → Courses → Enroll → Course page → Video/lesson → Dashboard.
- Confirm env vars (no missing `MONGO_URI` or `NEXTAUTH_SECRET`) so auth and DB work.
