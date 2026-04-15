"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CourseCard from "@/components/CourseCard";
import { LightningIcon, PaletteIcon } from "@/components/Icons";
import client from "@/lib/client";

const tabs = [
  "All courses",
  "Design",
  "Engineering",
  "Product",
  "Data Science",
  "Business",
];

export default function CourseCatalog() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollingId, setEnrollingId] = useState(null);
  const [activeTab, setActiveTab] = useState("All courses");

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        setError(null);
        const catalogRes = await client.get("/Course");
        if (catalogRes.data?.success) {
          const mapped = catalogRes.data.data.map((course) => ({
            ...course,
            displayCategory: course.category.toUpperCase(),
            author: course.instructorName,
            initials:
              course.instructorName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "??",
            lessons: course.lessonCount,
            status: course.isEnrolled ? "Enrolled" : "New",
            icon: course.category.toLowerCase().includes("design") ? (
              <PaletteIcon className="w-12 h-12" />
            ) : course.category.toLowerCase().includes("engineer") ? (
              <LightningIcon className="w-12 h-12" />
            ) : (
              "✨"
            ),
          }));
          setCourses(mapped);
        } else {
          setError(catalogRes.data?.message || "Failed to fetch courses");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const handleEnroll = async (e, courseId) => {
    e.stopPropagation();
    setEnrollingId(courseId);
    try {
      const response = await client.post(`/Enrollment/${courseId}`);
      if (response.data?.success) {
        setCourses((prev) =>
          prev.map((c) =>
            c.id === courseId
              ? { ...c, status: "Enrolled", isEnrolled: true }
              : c,
          ),
        );
        alert("Enrolled successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed.");
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCourses =
    activeTab === "All courses"
      ? courses
      : courses.filter(
          (c) => c.category.toLowerCase() === activeTab.toLowerCase(),
        );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <main className="min-h-screen bg-[#0f172a] p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Course Catalog</h1>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center justify-between border-b border-white/10 mb-8 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => (
            <button
              onClick={() => setActiveTab(tab)}
              key={tab}
              className={`px-4 py-3 text-sm font-medium transition-colors duration-150 relative
                ${activeTab === tab ? "text-white" : "text-slate-400 hover:text-white"}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {!loading && filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">
            No courses found in this category.
          </p>
        </div>
      )}

      {!loading && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="relative cursor-pointer group"
              onClick={() => {
                if (course.isEnrolled) {
                  router.push(`/course/${course.id}/lessons`);
                } else {
                  alert("Please enroll to view lessons.");
                }
              }}
            >
              <CourseCard
                course={{ ...course, category: course.displayCategory }}
              />

              {!course.isEnrolled && (
                <button
                  onClick={(e) => handleEnroll(e, course.id)}
                  disabled={enrollingId === course.id}
                  className="absolute top-4 right-4 z-20 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-blue-500 transition-all disabled:opacity-70"
                >
                  {enrollingId === course.id ? "..." : "Enroll Now"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
