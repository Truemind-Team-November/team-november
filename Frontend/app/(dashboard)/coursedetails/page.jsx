"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ThemeColors } from "@/components/ThemeColors";
import CourseDetailsContent from "./coursedetails-content";

function CourseDetailsLoading() {
  return (
    <main
      style={{ backgroundColor: ThemeColors.bgBlue }}
      className="min-h-screen text-zinc-300 font-sans p-4 md:p-8"
    >
      <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-6">
        <h1 className="text-2xl font-bold text-white">Course Details</h1>
        <Link
          href="/coursecatalog"
          className="bg-zinc-700/40 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-700"
        >
          Back to Catalog
        </Link>
      </div>
      <div className="rounded-2xl border border-slate-400 p-6 text-sm text-zinc-300">
        Loading course details...
      </div>
    </main>
  );
}

export default function CourseDetails() {
  return (
    <Suspense fallback={<CourseDetailsLoading />}>
      <CourseDetailsContent />
    </Suspense>
  );
}
