"use client";
<<<<<<< HEAD

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
=======
import { useState, useEffect } from "react";
import { ThemeColors } from '@/components/ThemeColors';
import client from "@/lib/client";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Pending', 'Submitted', 'Graded'];

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        // Using the endpoint from your Swagger image
        const response = await client.get('/Assignment/my');
        const data = response.data?.data || [];
        setAssignments(data);
        setFilteredAssignments(data);
      } catch (err) {
        console.error("Error fetching assignments:", err);
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
      } finally {
        setLoading(false);
      }
    };
<<<<<<< HEAD

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
=======
    fetchAssignments();
  }, []);

  // Filter logic whenever activeCategory or assignments change
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredAssignments(assignments);
    } else {
      setFilteredAssignments(
        assignments.filter(asn => asn.status === activeCategory)
      );
    }
  }, [activeCategory, assignments]);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Pending':
        return "bg-stone-800 text-orange-400 border-none";
      case 'Submitted':
        return "bg-blue-100 text-blue-800 border-none";
      case 'Graded':
        return "bg-blue-600/30 text-blue-400 border border-blue-500/40";
      default:
        return "bg-zinc-800 text-zinc-400";
    }
  };

  return (
    <main style={{ backgroundColor: ThemeColors.bgBlue }} className="min-h-screen text-zinc-300 font-sans p-4 md:p-8 overflow-y-auto">
      
      {/* Top Navigation */}
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
      <div className="flex max-md:flex-col max-md:gap-3 md:items-center justify-between mb-10">
        <h1 className="text-2xl font-bold text-white">Assignments</h1>
        <div className="flex items-center gap-6 flex-wrap">
          {categories.map((cat) => (
<<<<<<< HEAD
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-sm font-bold ${activeCategory === cat ? "text-white border-b-2 border-blue-500 pb-1" : "text-zinc-400 hover:text-zinc-200"}`}
=======
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`text-sm font-bold transition-all ${activeCategory === cat ? 'text-white border-b-2 border-blue-500 pb-1' : 'text-zinc-400 hover:text-zinc-200'}`}
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

<<<<<<< HEAD
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
=======
      <div className="space-y-6">
        {loading ? (
          <p className="text-center py-20 text-zinc-500 italic">Loading your assignments...</p>
        ) : filteredAssignments.length > 0 ? (
          filteredAssignments.map((asn) => (
            <section key={asn.id} className="border border-slate-400 rounded-2xl p-6 bg-transparent w-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">{asn.title}</h2>
                  <div className="flex gap-2 mt-2">
                    <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-3 py-1 rounded-full border border-red-500/30 text-center">
                      Due: {new Date(asn.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full text-center">
                      {asn.courseTitle}
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full flex items-center gap-2 ${getStatusStyles(asn.status)}`}>
                  {asn.status === 'Pending' && <span className="text-xs">→</span>}
                  {asn.status} {asn.grade ? `- ${asn.grade}/100` : ''}
                </span>
              </div>
              
              <p className="text-[11px] text-zinc-500 mb-6">
                {asn.description}
              </p>

              {/* Conditional View based on status */}
              {asn.status === 'Pending' ? (
                <>
                  <div className="border-2 border-dashed border-zinc-800 rounded-2xl py-12 flex flex-col items-center justify-center bg-black/5 mb-4">
                     <span className="text-2xl mb-2">☁️</span>
                     <p className="text-[10px] text-zinc-400">
                       <button className="text-blue-500 underline mr-1">Click to upload</button> or drag and drop
                     </p>
                     <p className="text-[9px] text-zinc-600 mt-1">PDF, Figma link, PNG, ZIP (max 50MB)</p>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Or paste Figma link here..." 
                      className="flex-1 bg-black/20 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-zinc-400 outline-none focus:border-blue-500"
                    />
                    <button className="bg-blue-600 text-white text-xs font-bold px-6 py-2 rounded-lg">Submit</button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="border border-zinc-800 rounded-xl p-4 bg-black/10">
                    <p className="text-[10px] font-bold text-white mb-1 flex items-center gap-2">📄 Submission Details</p>
                    <p className="text-[10px] text-zinc-500 ml-6">
                      {asn.submissionFile || "Link submitted"} on {new Date(asn.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {asn.status === 'Graded' ? (
                     <div className="border border-blue-900/30 rounded-xl p-4 bg-blue-900/5">
                        <p className="text-[11px] font-bold text-green-500 flex items-center gap-2 mb-1">
                          <span className="bg-green-500 text-white text-[8px] p-0.5 rounded">✓</span> Grade: {asn.grade}/100
                        </p>
                        <p className="text-[11px] text-zinc-400">{asn.feedback || "Great work!"}</p>
                     </div>
                  ) : (
                    <div className="border border-zinc-800 rounded-xl p-4 bg-blue-900/10">
                      <p className="text-[10px] font-bold text-white mb-1 flex items-center gap-2">Instructor Feedback (Pending)</p>
                      <p className="text-[10px] text-zinc-500 ml-1">Awaiting review from the instruction team...</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-slate-700 rounded-2xl">
            <p className="text-zinc-500 italic text-sm">No {activeCategory.toLowerCase()} assignments found.</p>
          </div>
        )}
      </div>
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
    </main>
  );
}
