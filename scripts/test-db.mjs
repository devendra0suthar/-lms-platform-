/**
 * Test MongoDB connection (no Next.js server needed).
 * Loads MONGO_URI from .env.local. Requires Node 20+ for --env-file.
 *
 * Run: node --env-file=.env.local scripts/test-db.mjs
 * Or:  npm run db:test
 */

import mongoose from "mongoose";

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI is not set (use .env.local or --env-file=.env.local)");
  process.exit(1);
}

const timeout = 30_000;
console.log("Connecting to MongoDB...");

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: timeout });
  console.log("OK – Database connection successful");
  process.exit(0);
} catch (e) {
  console.error("FAIL –", e.message);
  process.exit(1);
}
