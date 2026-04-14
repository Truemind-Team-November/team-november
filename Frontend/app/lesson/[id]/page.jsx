"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import client from "@/lib/client";

export default function SingleLessonPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [lesson, setLesson] = useState(null);
  const [courseInfo, setCourseInfo] = useState({ title: "", instructor: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Lesson Data
        const lessonRes = await client.get(`/Lesson/${id}`);
        const lessonData = lessonRes.data?.data;
        console.log(lessonData);
        

        if (!lessonData) return;

        // 2. Fetch Course Data for the Instructor Name
        const courseRes = await client.get(`/Course/${lessonData.courseId}`);
        console.log(courseRes);
        
        const courseData = courseRes.data?.data;

        setLesson(lessonData);
        setCourseInfo({
          title: courseData?.title || lessonData?.courseTitle,
          instructor: courseData?.instructor?.fullName || "Lead Instructor"
        });

      } catch (err) {
        console.error("Error fetching lesson details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFullData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!lesson) return <div className="text-white p-10 text-center">Lesson not found.</div>;

  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      <nav className="border-b border-white/5 bg-[#161f2c] p-4 flex items-center justify-between sticky top-0 z-50">
        <button 
          onClick={() => router.push(`/course/${lesson.courseId}/lessons`)} 
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
        >
          ✕ <span>Exit Lesson</span>
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{lesson.courseTitle}</p>
          <h2 className="text-sm font-bold truncate max-w-[200px] md:max-w-md">{lesson.lessonTitle}</h2>
        </div>
        <div className="w-20"></div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="aspect-video bg-black rounded-3xl border border-white/5 flex items-center justify-center shadow-2xl overflow-hidden">
               <div className="text-center">
                  <p className="text-5xl mb-4 opacity-20">📽️</p>
                  <p className="text-zinc-500 text-sm font-medium">Video Player Placeholder</p>
               </div>
            </div>

            <div className="bg-[#161f2c] p-8 rounded-3xl border border-white/5">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{lesson.lessonTitle}</h1>
                  <p className="text-blue-500 font-medium">Instructor: {courseInfo.instructor}</p>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none border-t border-white/5 pt-6">
                {/* FALLBACK LOGIC: Checks every possible text field */}
                <div className="text-zinc-300 leading-relaxed text-lg whitespace-pre-wrap">
                  {lesson.lessonDescription || 
                   lesson.content || 
                   (lesson.contents && lesson.contents.length > 0 ? lesson.contents[0].contentBody : null) || 
                   "No text content available for this module."}
                </div>

                {/* If there are multiple items in the contents array, map them here */}
                {lesson.contents?.length > 1 && (
                  <div className="mt-8 space-y-4">
                    {lesson.contents.slice(1).map((item, idx) => (
                      <div key={idx} className="p-6 bg-[#0f172a] rounded-2xl border border-white/5">
                        <div className="text-zinc-300">{item.contentBody}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#161f2c] p-6 rounded-3xl border border-white/5 shadow-xl">
              <h3 className="font-bold mb-4 text-zinc-400 text-xs uppercase tracking-widest">Your Progress</h3>
              <div className="flex items-center gap-4 mb-6">
                 <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${lesson.progressPercentage}%` }}></div>
                 </div>
                 <span className="text-sm font-bold text-blue-500">{lesson.progressPercentage}%</span>
              </div>
              
              <button 
                onClick={async () => {
                  try {
                    await client.post(`/Lesson/${id}/complete`);
                    alert("Module completed!");
                    router.back();
                  } catch (err) { console.error(err); }
                }}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20"
              >
                Complete Module
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}