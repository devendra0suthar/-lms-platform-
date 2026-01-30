import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;
const CONNECT_TIMEOUT_MS = 5_000;

const connectDB = async () => {
  if (!MONGODB_URI) throw new Error("MONGO_URI is not set");
  // Always call connect(); Mongoose reuses existing connection if already connected.
  // Skipping when readyState >= 1 can use a dead connection and cause "buffering timed out".
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: CONNECT_TIMEOUT_MS,
  });
};

export function isConnectionError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    const name = error.name;
    return (
      name === "MongooseServerSelectionError" ||
      name === "MongoNetworkError" ||
      name === "MongoServerSelectionError" ||
      msg.includes("connect to any servers") ||
      msg.includes("buffering timed out") ||
      msg.includes("querysrv econnrefused") ||
      msg.includes("enotfound") ||
      msg.includes("econnrefused") ||
      msg.includes("getaddrinfo") ||
      msg.includes("connection timed out") ||
      (msg.includes("whitelist") && msg.includes("ip"))
    );
  }
  return false;
}

export default connectDB;
