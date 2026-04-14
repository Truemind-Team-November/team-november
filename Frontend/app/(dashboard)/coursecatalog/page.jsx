"use client";
<<<<<<< HEAD
<<<<<<< HEAD
import { useEffect, useState } from "react";
=======
import { useState, useEffect } from "react";
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
import CourseCard from "@/components/CourseCard";
import Link from "next/link";
import client from "@/lib/client";

export default function CourseCatalog() {
<<<<<<< HEAD
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
=======
  const [userDiscipline, setUserDiscipline] = useState("");
  const [activeTab, setActiveTab] = useState("All courses");
=======

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "@/components/CourseCard";
import { LightningIcon, PaletteIcon } from "@/components/Icons";
import client from "@/lib/client";

export default function CourseCatalog() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
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

<<<<<<< HEAD
  const courses = [
    {
      title: "UI/UX Fundamentals",
      category: "Design", // Normalized category for filtering
      displayCategory: "UI/UX DESIGN",
      description: "Learn the core principles of user interface design and experience from scratch",
      lessons: 12,
      duration: "-6h",
      author: "Emeka Obi",
      initials: "EO",
      bgColor: "bg-[#9db1d6]",
      status: "Enrolled",
      icon: <PaletteIcon className="w-12.5 h-12.5" />,
      progress: 55,
    },
    {
      title: "Product Thinking",
      category: "Product",
      displayCategory: "PRODUCT MANAGEMENT",
      description: "Understand how to think like a product manager and solve user problems effectively",
      lessons: 8,
      duration: "-6h",
      author: "Segun Obe",
      initials: "SO",
      bgColor: "bg-[#3a4468]",
      status: "Enrolled",
      icon: <DarkSunIcon className="w-12.5 h-12.5" />,
      progress: 30,
    },
    {
      title: "Agile & Scrum Mastery",
      category: "Engineering",
      displayCategory: "ENGINEERING",
      description: "Master modern agile methodologies and learn to ship products fast and collaboratively",
      lessons: 10,
      duration: "-5h",
      author: "Tunde Ige",
      initials: "TI",
      bgColor: "bg-[#e6a8ff]",
      status: "New",
      icon: <LightningIcon className="w-12.5 h-12.5" />,
    },
    {
      title: "Data-Driven Decision Making",
      category: "Data Science",
      displayCategory: "DATA SCIENCE",
      description: "Use data to drive product decisions, identify trends and validate hypothesis",
      lessons: 15,
      duration: "-5h",
      author: "Ife Babs",
      initials: "IB",
      bgColor: "bg-[#1a6b46]",
      icon: "📊",
    },
    {
      title: "Communications & Presentation",
      category: "Business",
      displayCategory: "SOFT SKILLS",
      description: "Build confidence, clarity, and storytelling skills for professional settings",
      lessons: 6,
      duration: "-5h",
      author: "Herny Jaji",
      initials: "HJ",
      bgColor: "bg-[#2a4e21]",
      icon: "🎤",
    },
    {
      title: "Building APIs With Node.js",
      category: "Engineering",
      displayCategory: "BACKEND DEVELOPMENT",
      description: "Develop powerful systems and APIs that run behind the scenes",
      lessons: 10,
      duration: "-5h",
      author: "Adeola Kore",
      initials: "AK",
      bgColor: "bg-[#fb7c56]",
      icon: "🧩",
    },
    {
      title: "Design Principles",
      category: "Design",
      displayCategory: "GRAPHICS DESIGN",
      description: "Learn to create stunning visuals and user friendly designs",
      lessons: 10,
      duration: "-9h",
      author: "Samuel Moon",
      initials: "SM",
      bgColor: "bg-[#f5e642]",
      icon: "✨",
    },
    {
      title: "HTML & CSS Fundamentals",
      category: "Engineering",
      displayCategory: "FRONTEND DEVELOPMENT",
      description: "Build responsive and interactive user interfaces for web",
      lessons: 11,
      duration: "-8h",
      author: "Aaron Akor",
      initials: "AA",
      bgColor: "bg-[#2ec4b6]",
      icon: "🖥️",
    },
    {
      title: "Git & Version Control",
      category: "Engineering",
      displayCategory: "ENGINEERING",
      description: "Learn how to collaborate on code using Git, Github, and branching strategies",
      lessons: 13,
      duration: "-5h",
      author: "Olumide Obe",
      initials: "OO",
      bgColor: "bg-[#f4a5b8]",
      icon: "🔒",
    },
  ];
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
=======
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
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d

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
<<<<<<< HEAD
<<<<<<< HEAD
      <div className="mb-6">
=======
      {/* Page Header */}
      <div className="mb-2 flex items-center justify-between">
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
        <h1 className="text-xl font-bold text-white">Course Catalog</h1>
        {!loading && userDiscipline && (
          <div className="text-[10px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 uppercase font-bold tracking-widest">
            {userDiscipline} Track
          </div>
        )}
      </div>

<<<<<<< HEAD
      <div className="flex items-center justify-between border-b border-white/10 mb-8">
        <div className="flex gap-1">
=======
      {/* Tab Bar */}
      <div className="flex items-center justify-between border-b border-white/10 mb-8 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
          {tabs.map((tab) => (
            <button
              onClick={() => handleTabClick(tab)}
              key={tab}
<<<<<<< HEAD
              className={`px-4 py-3 text-sm font-medium transition-colors duration-150
                ${selectedTab === tab && !showMyCourses
                  ? "text-white border-b-2 border-blue-400 -mb-px"
                  : "text-slate-400 hover:text-white"
                }`}
=======
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium transition-colors duration-150 relative
                ${activeTab === tab ? "text-white" : "text-slate-400 hover:text-white"}`}
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400"></div>
              )}
            </button>
          ))}
        </div>
<<<<<<< HEAD
        <button 
          onClick={handleMyCourses} 
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors mb-2 cursor-pointer
            ${showMyCourses ? "text-white" : "text-slate-300 hover:text-white"}`}
        >
          <span className="text-blue-400">▶</span>
          My Courses
        </button>
=======

        {/* My Courses link */}
        <Link href="/dashboard" className="flex items-center gap-1.5 text-slate-300 text-sm font-medium hover:text-white transition-colors mb-2 whitespace-nowrap ml-4">
          <span className="text-blue-400 text-[10px]">▶</span>
          Go to Dashboard
        </Link>
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
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
<<<<<<< HEAD
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
=======
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => (
            <Link key={index} href={"/lesson"}>
              {/* Note: I added 'category: course.displayCategory' inside the mapping to match your UI component expectations */}
              <CourseCard course={{...course, category: course.displayCategory}} />
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-500 italic">No courses available in this category yet.</p>
          </div>
        )}
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
=======
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
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
      </div>
      )}
    </main>
  );
}