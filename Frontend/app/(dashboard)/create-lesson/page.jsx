"use client";

import { useState, useEffect } from "react";
import client from "@/lib/client";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

export default function CreateLessonPage() {
  const router = useRouter();

  // States
  const [courseId, setCourseId] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    order: 1,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const autoDetectCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const profileRes = await client.get("/Profile/me");
        const discipline = profileRes.data?.data?.personalInformation?.discipline;

        if (!discipline) {
          setError("Could not find your assigned discipline in your profile.");
          return;
        }

        const coursesRes = await client.get("/Course");
        const allCourses = coursesRes.data?.data || [];

        const matchedCourse = allCourses.find(
          (c) => c.title?.toLowerCase() === discipline.toLowerCase()
        );

        if (matchedCourse) {
          setCourseId(matchedCourse.id);
          setCourseTitle(matchedCourse.title);
        } else {
          setError(`No active course found matching the "${discipline}" discipline.`);
        }
      } catch (err) {
        console.error("Auto-detect error:", err);
        setError("Technical error connecting to course registry.");
      } finally {
        setLoading(false);
      }
    };

    autoDetectCourse();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseId) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        courseId: courseId,
      };

      console.log(payload);
      
      const res = await client.post("/Lesson", payload);
      console.log(res);
      
      
      if (res.data?.success) {
        alert("Lesson published successfully!");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Publishing error:", err);
      
      // --- SPECIFIC ERROR HANDLING LOGIC ---
      const responseData = err.response?.data;
      
      if (responseData?.errors) {
        // Extracts all validation messages into a single string
        const errorMessages = Object.values(responseData.errors)
          .flat()
          .join("\n");
        alert(`Validation Error:\n${errorMessages}`);
      } else {
        alert(responseData?.message || "Failed to publish lesson.");
      }
      // -------------------------------------
      
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#101723]"><Spinner message="Syncing with Course Registry..." /></div>;

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#101723] text-center p-6">
      <div className="text-4xl mb-4">🚫</div>
      <h2 className="text-xl font-bold text-white mb-2">Assignment Missing</h2>
      <p className="text-zinc-500 max-w-sm">{error}</p>
      <button onClick={() => router.back()} className="mt-6 text-blue-500 font-bold hover:underline">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#101723] p-6 lg:p-12 text-[#FAFCFF]">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">New Lesson</h1>
          <p className="text-zinc-500 mt-2">
            Posting to: <span className="text-blue-400 font-bold">{courseTitle}</span> 
            <span className="text-[10px] ml-2 opacity-30 font-mono">({courseId})</span>
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#161f2c] p-8 rounded-2xl border border-white/5 shadow-2xl">
          <div>
            <label className="block text-xs font-bold uppercase mb-2 tracking-widest text-zinc-500">Lesson Title</label>
            <input 
              type="text"
              required
              className="w-full bg-[#101723] border border-white/10 rounded-xl p-4 text-sm focus:border-blue-500 outline-none transition-all"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="w-32">
            <label className="block text-xs font-bold uppercase mb-2 tracking-widest text-zinc-500">Lesson Order</label>
            <input 
              type="number"
              className="w-full bg-[#101723] border border-white/10 rounded-xl p-4 text-sm outline-none"
              value={formData.order}
              onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-2 tracking-widest text-zinc-500">Content</label>
            <textarea 
              rows="10"
              required
              className="w-full bg-[#101723] border border-white/10 rounded-xl p-4 text-sm focus:border-blue-500 outline-none transition-all"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 py-4 rounded-xl font-bold text-white hover:bg-blue-500 disabled:opacity-50 transition-all"
          >
            {submitting ? "Publishing..." : "Create & Publish"}
          </button>
        </form>
      </div>
    </div>
  );
}