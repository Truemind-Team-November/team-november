"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import client from "@/lib/client";

export default function LessonsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [lessons, setLessons] = useState([]);
  const [courseDetails, setCourseDetails] = useState({
    title: "",
    instructorName: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);

        // 1. Fetch Course details
        const courseRes = await client.get(`/Course/${id}`);
        const courseData = courseRes.data?.data;

        if (!courseData?.isEnrolled) {
          alert("Unauthorized: Please enroll in this course first.");
          router.push("/coursecatalog");
          return;
        }

        // ACCESSING THE INSTRUCTOR NAME FROM THE NESTED OBJECT
        setCourseDetails({
          title: courseData.title || "Course Lessons",
          instructorName: courseData.instructor?.fullName || "TMI Instructor"
        });

        // 2. Fetch Lessons using the verified endpoint
        const lessonsRes = await client.get(`/Lesson/course/${id}`);
        
        if (lessonsRes.data?.success) {
          const sortedLessons = (lessonsRes.data.data || []).sort((a, b) => a.order - b.order);
          setLessons(sortedLessons);
        }
      } catch (err) {
        console.error("Error loading curriculum:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadContent();
  }, [id, router]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
       <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-zinc-400 font-medium animate-pulse">Syncing Curriculum...</p>
       </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0f172a] p-6 lg:p-12 text-white">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <button 
            onClick={() => router.push('/coursecatalog')} 
            className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-all font-semibold group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Catalog
          </button>
          
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight leading-tight">
            {courseDetails.title}
          </h1>
          
          {/* INSTRUCTOR DISPLAY SECTION */}
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 w-fit">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/20">
              {courseDetails.instructorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Instructor</p>
              <p className="text-white font-semibold">{courseDetails.instructorName}</p>
            </div>
          </div>
        </header>

        <div className="space-y-4">
          {lessons.length > 0 ? (
            lessons.map((lesson, index) => (
              <div 
                key={lesson.id}
                onClick={() => router.push(`/lesson/${lesson.id}`)}
                className="group flex items-center justify-between p-6 bg-[#161f2c] rounded-2xl border border-white/5 hover:border-blue-500/40 hover:bg-[#1c2635] transition-all cursor-pointer shadow-xl"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#0f172a] text-blue-500 font-black text-2xl border border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold opacity-50">
                       Module {lesson.order || index + 1}
                    </p>
                  </div>
                </div>
                <div className="text-zinc-700 group-hover:text-blue-400 transform group-hover:translate-x-2 transition-all">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-[#161f2c] rounded-3xl border border-dashed border-white/10">
              <div className="text-5xl mb-6 opacity-20">📖</div>
              <p className="text-zinc-500 font-medium">No modules have been added to this curriculum yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}