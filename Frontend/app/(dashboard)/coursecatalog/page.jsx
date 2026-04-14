"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "@/components/CourseCard";
import { LightningIcon, PaletteIcon } from "@/components/Icons";
import client from "@/lib/client";

export default function CourseCatalog() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [activeTab, setActiveTab] = useState("All courses");

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const catalogRes = await client.get("/Course");
        if (catalogRes.data?.success) {
          const mapped = catalogRes.data.data.map(course => ({
            ...course,
            displayCategory: course.category.toUpperCase(),
            author: course.instructorName,
            initials: course.instructorName?.split(' ').map(n => n[0]).join('').toUpperCase() || "??",
            
            // BRIDGE THE GAP: Map API 'lessonCount' to the Card's 'lessons' prop
            lessons: course.lessonCount, 
            
            status: course.isEnrolled ? "Enrolled" : "New",
            icon: course.category.toLowerCase().includes("design") ? <PaletteIcon className="w-12 h-12" /> : 
                  course.category.toLowerCase().includes("engineer") ? <LightningIcon className="w-12 h-12" /> : "✨"
          }));
          setCourses(mapped);
        }
      } catch (err) {
        console.error("Fetch error:", err);
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
        setCourses(prev => prev.map(c => 
          c.id === courseId ? { ...c, status: "Enrolled", isEnrolled: true } : c
        ));
        alert("Enrolled successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed.");
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCourses = activeTab === "All courses" 
    ? courses 
    : courses.filter(c => c.category.toLowerCase() === activeTab.toLowerCase());

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0f172a] p-8">
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
            <CourseCard course={{...course, category: course.displayCategory}} />
            
            {!course.isEnrolled && (
              <button
                onClick={(e) => handleEnroll(e, course.id)}
                disabled={enrollingId === course.id}
                className="absolute top-4 right-4 z-20 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-blue-500 transition-all"
              >
                {enrollingId === course.id ? "..." : "Enroll Now"}
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}