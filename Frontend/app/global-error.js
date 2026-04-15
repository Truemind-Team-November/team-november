"use client";

import { ThemeColors } from "@/components/ThemeColors";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body
        style={{ backgroundColor: ThemeColors.bgBlue }}
        className="min-h-screen text-zinc-300 font-sans p-4 md:p-8"
      >
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="max-w-md w-full">
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
              <h1 className="text-3xl font-bold text-red-400 mb-2">
                Something went wrong!
              </h1>
              <p className="text-sm text-zinc-300 mb-6">
                {error?.message || "An unexpected error occurred."}
              </p>
              <button
                onClick={() => reset()}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-all"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
