"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import client from "@/lib/client";

export default function GlobalPostAssignmentPage() {
  const router = useRouter();
  
  // State for logic
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for form
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: ""
  });

  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true);
        
        // 1. Verify User is an Instructor
        const userRes = await client.get("/Dashboard/me");
        const userData = userRes.data?.data;

        if (userData?.identityCard?.role !== "Instructor") {
          alert("Unauthorized: This page is for instructors only.");
          router.push("/dashboard");
          return;
        }

        // 2. Fetch all courses so instructor can choose where to post
        const courseRes = await client.get("/Course");
        const courseList = courseRes.data?.data || [];
        setCourses(courseList);

      } catch (err) {
        console.error("Initialization failed:", err);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCourseId) {
      alert("Please select a course to assign this task to.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        courseId: selectedCourseId,
        title: formData.title,
        description: formData.description,
        dueDate: new Date(formData.dueDate).toISOString()
      };

      const res = await client.post("/Assignment", payload);

      if (res.data?.success) {
        alert("Assignment published successfully!");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Post failed:", err);
      alert(err.response?.data?.message || "Failed to post assignment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      <p className="text-zinc-500 font-medium animate-pulse">Preparing workspace...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0f172a] p-6 lg:p-20 text-white">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight">Post New Assignment</h1>
          <p className="text-zinc-500 mt-2">Create and distribute tasks to your students.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-[#161f2c] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
          
          {/* COURSE SELECTOR */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Assign to Course</label>
            <select 
              required
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full bg-[#0f172a] border border-white/10 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer text-zinc-300"
            >
              <option value="" className="text-zinc-600">-- Select a Course --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id} className="text-white">
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* TITLE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Assignment Title</label>
            <input 
              required
              className="w-full bg-[#0f172a] border border-white/10 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g., Data Visualization Project"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Instructions</label>
            <textarea 
              required
              rows="5"
              className="w-full bg-[#0f172a] border border-white/10 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="What should the students do?"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* DUE DATE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Submission Deadline</label>
            <input 
              type="datetime-local"
              required
              className="w-full bg-[#0f172a] border border-white/10 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all text-zinc-300"
              value={formData.dueDate}
              onChange={e => setFormData({...formData, dueDate: e.target.value})}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-5 rounded-2xl font-black transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 ${
              isSubmitting ? 'bg-zinc-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                PUBLISHING...
              </>
            ) : (
              'PUBLISH ASSIGNMENT'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}