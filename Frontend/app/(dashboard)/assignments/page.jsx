"use client";

import { useEffect, useMemo, useState } from "react";
import { ThemeColors } from "@/components/ThemeColors";
import client from "@/lib/client";

const categories = ["All", "Pending", "Submitted", "Graded"];

export default function Assignments() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        setLoading(true);
        setError("");
        const statusQuery = activeCategory === "All" ? "" : `?status=${encodeURIComponent(activeCategory)}`;
        const response = await client.get(`/Assignment/my${statusQuery}`);
        setAssignments(Array.isArray(response.data?.data) ? response.data.data : []);
      } catch (err) {
        console.error("Assignments fetch error:", err);
        setError("Unable to load assignments right now.");
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, [activeCategory]);

  const visibleAssignments = useMemo(() => assignments, [assignments]);

  const statusStyles = {
    Pending: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
    Submitted: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    Graded: "bg-green-500/20 text-green-300 border border-green-500/30",
  };

  return (
    <main style={{ backgroundColor: ThemeColors.bgBlue }} className="min-h-screen text-zinc-300 font-sans p-4 md:p-8">
      <div className="flex max-md:flex-col max-md:gap-3 md:items-center justify-between mb-10">
        <h1 className="text-2xl font-bold text-white">Assignments</h1>
        <div className="flex items-center gap-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-sm font-bold ${activeCategory === cat ? "text-white border-b-2 border-blue-500 pb-1" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="rounded-2xl border border-slate-400 p-6 text-sm text-zinc-300">Loading assignments...</div>}
      {error && <div className="rounded-2xl border border-red-500/40 p-6 text-sm text-red-300">{error}</div>}

      {!loading && !error && visibleAssignments.length === 0 && (
        <div className="rounded-2xl border border-slate-400 p-10 text-center">
          <p className="text-xl font-bold text-white mb-2">No assignments found</p>
          <p className="text-sm text-zinc-400">Assignments in this category will appear here once available.</p>
        </div>
      )}

      {!loading && !error && visibleAssignments.length > 0 && (
        <div className="space-y-6">
          {visibleAssignments.map((item) => {
            const dueDate = item.dueDate ? new Date(item.dueDate) : null;
            const status = item.status || "Pending";
            const badgeClass = statusStyles[status] || "bg-zinc-700/40 text-zinc-200 border border-zinc-600";

            return (
              <section key={item.assignmentId} className="border border-slate-400 rounded-2xl p-6 bg-transparent w-full">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">{item.title}</h2>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="bg-zinc-700/30 text-zinc-200 text-[10px] font-bold px-3 py-1 rounded-full border border-zinc-600/40">
                        Due: {dueDate ? dueDate.toLocaleDateString() : "-"}
                      </span>
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">{item.courseTitle}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full ${badgeClass}`}>{status}{item.score != null ? ` - ${item.score}/100` : ""}</span>
                </div>

                <p className="text-[12px] text-zinc-400 mb-4">{item.description}</p>

                <div className="grid md:grid-cols-2 gap-3 text-xs text-zinc-400">
                  <p>Submitted: {item.submittedAt ? new Date(item.submittedAt).toLocaleString() : "Not submitted"}</p>
                  <p>Past due: {item.isPastDue ? "Yes" : "No"}</p>
                  <p>Attachment: {item.submissionAttachmentName || "None"}</p>
                  <p>Feedback: {item.feedback || "No feedback yet"}</p>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
