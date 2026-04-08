"use client";
import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";
import client from "@/lib/client";

export default function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("All courses");
  const [showMyCourses, setShowMyCourses] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [courses, selectedTab, showMyCourses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.get('/course');
      if (response.data.success) {
        setCourses(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to fetch courses");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = courses;

    if (showMyCourses) {
      filtered = filtered.filter(course => course.isEnrolled);
    }

    if (selectedTab !== "All courses") {
      const categoryMap = {
        "Design": "UI/UX DESIGN",
        "Engineering": "ENGINEERING",
        "Product": "PRODUCT MANAGEMENT",
        "Data Science": "DATA SCIENCE",
        "Business": "BUSINESS"
      };
      const selectedCategory = categoryMap[selectedTab];
      if (selectedCategory) {
        filtered = filtered.filter(course =>
          course.category?.toUpperCase() === selectedCategory.toUpperCase()
        );
      }
    }

    setFilteredCourses(filtered);
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setShowMyCourses(false);
  };

  const handleMyCourses = () => {
    setShowMyCourses(!showMyCourses);
  };

  const tabs = [
    "All courses",
    "Design",
    "Engineering",
    "Product",
    "Data Science",
    "Business",
  ];

  return (
    <main className="min-h-screen bg-[#0f172a] p-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Course Catalog</h1>
      </div>

      <div className="flex items-center justify-between border-b border-white/10 mb-8">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              onClick={() => handleTabClick(tab)}
              key={tab}
              className={`px-4 py-3 text-sm font-medium transition-colors duration-150
                ${selectedTab === tab && !showMyCourses
                  ? "text-white border-b-2 border-blue-400 -mb-px"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button 
          onClick={handleMyCourses} 
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors mb-2 cursor-pointer
            ${showMyCourses ? "text-white" : "text-slate-300 hover:text-white"}`}
        >
          <span className="text-blue-400">▶</span>
          My Courses
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-slate-400 mt-4">Loading courses...</p>
        </div>
      )}

      {!loading && filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">
            {showMyCourses ? "You haven't enrolled in any courses yet." : "No courses found."}
          </p>
          {showMyCourses && (
            <button 
              onClick={() => { setShowMyCourses(false); setSelectedTab("All courses"); }}
              className="mt-4 text-blue-500 hover:text-blue-400 underline"
            >
              Browse all courses
            </button>
          )}
        </div>
      )}

      {!loading && filteredCourses.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <Link key={index} href={`/lesson?courseId=${course.id}`}>
            <CourseCard 
              course={{
                title: course.title,
                category: course.category,
                description: course.description,
                lessons: course.lessonCount,
                duration: `${course.estimatedHours}h`,
                author: course.instructorName,
                initials: course.instructorName?.split(' ').map(n => n[0]).join(''),
                bgColor: "bg-[#9db1d6]",
                status: course.isEnrolled ? "Enrolled" : "New",
                progress: Math.round(course.progressPercentage || 0),
              }} 
            />
          </Link>
        ))}
      </div>
      )}
    </main>
  );
}
