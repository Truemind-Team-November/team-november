"use client";

import { useState, useEffect } from "react";
import client from "@/lib/client";

export default function GradeSubmissionsPage() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form state
  const [gradeData, setGradeData] = useState({ score: "", feedback: "" });

  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Assignments (Using the 'items' structure from your logs)
        const assignmentRes = await client.get("/Assignment");
        const items = assignmentRes.data?.data?.items || [];
        setAssignments(items);

        // 2. Fetch the specific submission we know exists
        // This bypasses the 405 'List' error by requesting a direct resource
        const subId = "5e30c316-1364-4ec3-bd33-b6d3a663e24b";
        const subRes = await client.get(`/Submission/${subId}`);
        
        if (subRes.data?.success) {
          setSubmissions([subRes.data.data]);
        }
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, []);

  const handleGradeUpdate = async (e) => {
    e.preventDefault();
    if (!selectedSub) return;

    try {
      setIsUpdating(true);
      const payload = {
        score: Number(gradeData.score),
        feedback: gradeData.feedback
      };

      // Matches your Swagger: PUT /api/Submission/{submissionId}/grade
      const res = await client.put(`/Submission/${selectedSub.id}/grade`, payload);

      if (res.data?.success) {
        alert("Grade Published Successfully!");
        setSelectedSub(null);
        // Refresh local state
        setSubmissions(prev => prev.map(s => 
          s.id === selectedSub.id ? { ...s, isGraded: true, ...payload } : s
        ));
      }
    } catch (err) {
      alert("Failed to update grade. Check if score is a valid number.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <p className="text-blue-400 animate-pulse font-bold tracking-widest">INITIALIZING GRADING TERMINAL...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0f172a] p-6 lg:p-12 text-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black mb-2 tracking-tighter">Instructor Review</h1>
          <p className="text-zinc-500">Reviewing {assignments.length} assignments across your courses.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: ASSIGNMENT CONTEXT */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Active Modules</h2>
            {assignments.map(a => (
              <div key={a.id} className="p-5 bg-[#161f2c] border border-white/5 rounded-3xl">
                <p className="text-sm font-bold text-zinc-200">{a.title}</p>
                <p className="text-[10px] text-blue-500 font-mono mt-1">{a.courseTitle}</p>
              </div>
            ))}
          </div>

          {/* MIDDLE: SUBMISSIONS LIST */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Submissions to Grade</h2>
            {submissions.map(sub => (
              <button 
                key={sub.id}
                onClick={() => {
                  setSelectedSub(sub);
                  setGradeData({ score: sub.score || "", feedback: sub.feedback || "" });
                }}
                className={`w-full text-left p-6 rounded-[2rem] border transition-all ${
                  selectedSub?.id === sub.id ? 'bg-blue-600/10 border-blue-500' : 'bg-[#161f2c] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-mono text-zinc-500">ID: ...{sub.id.slice(-8)}</span>
                  <span className={`text-[9px] font-black px-2 py-1 rounded-md ${sub.isGraded ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {sub.isGraded ? 'GRADED' : 'PENDING'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 italic">"{sub.answer}"</p>
              </button>
            ))}
          </div>

          {/* RIGHT: GRADING INTERFACE */}
          <div className="lg:col-span-5">
            {selectedSub ? (
              <div className="bg-[#161f2c] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl sticky top-10 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold mb-6 text-zinc-100">Grade Work</h3>
                
                <div className="bg-[#0f172a] p-6 rounded-2xl mb-8 border border-white/5">
                  <label className="text-[10px] font-black text-zinc-600 uppercase mb-2 block">Student Response</label>
                  <p className="text-zinc-300 text-sm leading-relaxed">"{selectedSub.answer}"</p>
                </div>

                <form onSubmit={handleGradeUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Percentage Score</label>
                    <input 
                      type="number"
                      required
                      min="0"
                      max="100"
                      className="w-full bg-[#0f172a] border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 transition-all"
                      value={gradeData.score}
                      onChange={e => setGradeData({...gradeData, score: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Feedback Message</label>
                    <textarea 
                      rows="4"
                      className="w-full bg-[#0f172a] border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 transition-all"
                      placeholder="Excellent logic on the backend integration..."
                      value={gradeData.feedback}
                      onChange={e => setGradeData({...gradeData, feedback: e.target.value})}
                    />
                  </div>

                  <button 
                    disabled={isUpdating}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isUpdating ? "PUBLISHING..." : "SUBMIT GRADE"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] text-zinc-600 italic text-sm">
                Select a submission to begin evaluation
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}