"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ThemeColors } from "@/components/ThemeColors";
import client from "@/lib/client";

export default function CourseDetails() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) {
        setLoading(false);
        setError("");
        setCourse(null);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await client.get(`/Course/${courseId}`);
        setCourse(response.data?.data || null);
      } catch (err) {
        console.error("Course details fetch error:", err);
        setError("Unable to load course details right now.");
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const progressValue = useMemo(() => Math.max(0, Math.min(100, Math.round(Number(course?.progressPercentage || 0)))), [course]);

  return (
    <main style={{ backgroundColor: ThemeColors.bgBlue }} className="min-h-screen text-zinc-300 font-sans p-4 md:p-8">
      <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-6">
        <h1 className="text-2xl font-bold text-white">Course Details</h1>
        <Link href="/coursecatalog" className="bg-zinc-700/40 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-700">
          Back to Catalog
        </Link>
      </div>

      {!courseId && (
        <div className="rounded-2xl border border-slate-400 p-10 text-center">
          <p className="text-xl font-bold text-white mb-2">No course selected</p>
          <p className="text-sm text-zinc-400 mb-4">Select a course from the catalog to view details.</p>
          <Link href="/coursecatalog" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
            Open Course Catalog
          </Link>
        </div>
      )}

      {courseId && loading && <div className="rounded-2xl border border-slate-400 p-6 text-sm text-zinc-300">Loading course details...</div>}
      {courseId && error && <div className="rounded-2xl border border-red-500/40 p-6 text-sm text-red-300">{error}</div>}

      {courseId && !loading && !error && !course && (
        <div className="rounded-2xl border border-slate-400 p-10 text-center">
          <p className="text-xl font-bold text-white mb-2">Course not found</p>
          <p className="text-sm text-zinc-400">This course may have been removed or is unavailable.</p>
        </div>
      )}

      {courseId && !loading && !error && course && (
        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
          <section className="border border-slate-400 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-3">{course.title}</h2>
            <p className="text-sm text-zinc-400 mb-4">{course.description}</p>

            <div className="flex flex-wrap gap-3 mb-5">
              <span className="bg-blue-600/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30">{course.category}</span>
              <span className="bg-zinc-700/30 text-zinc-200 text-xs font-bold px-3 py-1 rounded-full border border-zinc-600/40">{course.lessonCount} lessons</span>
              <span className="bg-zinc-700/30 text-zinc-200 text-xs font-bold px-3 py-1 rounded-full border border-zinc-600/40">{course.estimatedHours} hours</span>
              <span className="bg-zinc-700/30 text-zinc-200 text-xs font-bold px-3 py-1 rounded-full border border-zinc-600/40">Instructor: {course.instructor?.fullName}</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-3">Modules</h3>
            {Array.isArray(course.modules) && course.modules.length > 0 ? (
              <div className="space-y-3">
                {course.modules.map((module) => (
                  <div key={module.lessonId} className="border border-slate-500/40 rounded-xl p-4">
                    <p className="text-sm font-bold text-white">{module.order}. {module.title}</p>
                    <p className="text-xs text-zinc-400 mt-1">{module.description || "No description"}</p>
                    <p className="text-xs text-zinc-500 mt-2">Estimated: {module.estimatedMinutes || 0} mins • Contents: {module.contentCount}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400">No modules available yet.</p>
            )}
          </section>

          <aside className="border border-slate-400 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Your Progress</h3>
            <p className="text-3xl font-bold text-blue-300">{progressValue}%</p>
            <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${progressValue}%` }} />
            </div>
            <p className="text-xs text-zinc-400">{course.isEnrolled ? "Enrolled" : "Not enrolled"}</p>
            {course.resumeLessonId && (
              <Link href={`/lesson?lessonId=${course.resumeLessonId}`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
                Resume Course
              </Link>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
