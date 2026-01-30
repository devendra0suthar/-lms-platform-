import Link from "next/link";
import { Card, CardTitle } from "./Card";

const ATLAS_NETWORK_ACCESS_URL =
  "https://cloud.mongodb.com/v2#/security/network/access";

type DatabaseUnavailableProps = { errorMessage?: string };

export function DatabaseUnavailable({ errorMessage }: DatabaseUnavailableProps = {}) {
  return (
    <Card className="mx-auto max-w-lg border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
      <CardTitle className="text-amber-800 dark:text-amber-200">
        Database unavailable
      </CardTitle>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-amber-700 dark:text-amber-300">
        {errorMessage && (
          <p className="rounded bg-amber-200/50 p-2 font-mono text-xs dark:bg-amber-900/50">
            Error: {errorMessage}
          </p>
        )}
        <p>We couldn’t connect to MongoDB. Fix it:</p>
        <ol className="list-inside list-decimal space-y-1">
          <li>
            Open{" "}
            <Link
              href={ATLAS_NETWORK_ACCESS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              MongoDB Atlas → Network Access
            </Link>
          </li>
          <li>Click “Add IP Address” → “Add Current IP Address”</li>
          <li>Wait 1–2 minutes, then refresh this page</li>
        </ol>
        <p>
          Or use local MongoDB: set{" "}
          <code className="rounded bg-amber-200/50 px-1 dark:bg-amber-900/50">
            MONGO_URI=mongodb://localhost:27017/lms
          </code>{" "}
          in <code className="rounded bg-amber-200/50 px-1 dark:bg-amber-900/50">.env.local</code>.
        </p>
      </div>
    </Card>
  );
}
