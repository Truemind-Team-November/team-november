"use client";
<<<<<<< HEAD
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
=======

import { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeColors } from "@/components/ThemeColors";
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
import client from "@/lib/client";

const categories = ["All", "Pending", "Submitted", "Graded"];

export default function Assignments() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [assignments, setAssignments] = useState([]);
  const [submissionDrafts, setSubmissionDrafts] = useState({});
  const [submitLoadingById, setSubmitLoadingById] = useState({});
  const [submitFeedbackById, setSubmitFeedbackById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

<<<<<<< HEAD
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
=======
  const loadAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const statusQuery = activeCategory === "All" ? "" : `?status=${encodeURIComponent(activeCategory)}`;
      const response = await client.get(`/Assignment/my${statusQuery}`);
      console.log(response);
      
      setAssignments(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (err) {
      console.error("Assignments fetch error:", err);
      setError("Unable to load assignments right now.");
      setAssignments([]);
    } finally {
      setLoading(false);
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
    }
  }, [activeCategory]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const visibleAssignments = useMemo(() => assignments, [assignments]);

  const statusStyles = {
    Pending: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
    Submitted: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    Graded: "bg-green-500/20 text-green-300 border border-green-500/30",
  };

  const setDraftValue = (assignmentId, patch) => {
    setSubmissionDrafts((prev) => ({
      ...prev,
      [assignmentId]: {
        answer: "",
        file: null,
        ...prev[assignmentId],
        ...patch,
      },
    }));
  };

  const setSubmitFeedback = (assignmentId, type, text) => {
    setSubmitFeedbackById((prev) => ({ ...prev, [assignmentId]: { type, text } }));
  };

  const handleSubmitAssignment = async (assignment) => {
    const assignmentId = assignment.assignmentId;
    const draft = submissionDrafts[assignmentId] || {};
    const answer = (draft.answer || "").trim();
    const file = draft.file || null;

    if (!answer && !file) {
      setSubmitFeedback(assignmentId, "error", "Add an answer or attachment before submitting.");
      return;
    }

    setSubmitFeedback(assignmentId, "info", "Submitting...");
    setSubmitLoadingById((prev) => ({ ...prev, [assignmentId]: true }));

    try {
      if (file) {
        const payload = new FormData();
        payload.append("assignmentId", assignmentId);
        if (answer) {
          payload.append("answer", answer);
        }
        payload.append("file", file);

        await client.post("/Submission/upload", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await client.post("/Submission", {
          assignmentId,
          answer,
        });
      }

      setSubmitFeedback(assignmentId, "success", "Submission sent successfully.");
      setSubmissionDrafts((prev) => ({ ...prev, [assignmentId]: { answer: "", file: null } }));
      await loadAssignments();
    } catch (submitError) {
      console.error("Submission error:", submitError);
      const message = submitError.response?.data?.message || "Unable to submit assignment right now.";
      setSubmitFeedback(assignmentId, "error", message);
    } finally {
      setSubmitLoadingById((prev) => ({ ...prev, [assignmentId]: false }));
    }
  };

  return (
    <main style={{ backgroundColor: ThemeColors.bgBlue }} className="min-h-screen text-zinc-300 font-sans p-4 md:p-8 overflow-y-auto">
<<<<<<< HEAD
      
      {/* Top Navigation */}
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
=======
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
      <div className="flex max-md:flex-col max-md:gap-3 md:items-center justify-between mb-10">
        <h1 className="text-2xl font-bold text-white">Assignments</h1>
        <div className="flex items-center gap-6 flex-wrap">
          {categories.map((cat) => (
<<<<<<< HEAD
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
=======
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-sm font-bold transition-all ${activeCategory === cat ? "text-white border-b-2 border-blue-500 pb-1" : "text-zinc-400 hover:text-zinc-200"}`}
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

<<<<<<< HEAD
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
=======
      {loading && <div className="rounded-2xl border border-slate-400 p-6 text-sm text-zinc-300">Loading assignments...</div>}
      {error && <div className="rounded-2xl border border-red-500/40 p-6 text-sm text-red-300">{error}</div>}
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d

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
            const draft = submissionDrafts[item.assignmentId] || { answer: "", file: null };
            const submitState = submitFeedbackById[item.assignmentId];
            const isSubmitting = Boolean(submitLoadingById[item.assignmentId]);
            const canSubmit = !item.submittedAt && !item.isPastDue;

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
                  <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full ${badgeClass}`}>
                    {status}
                    {item.score != null ? ` - ${item.score}/100` : ""}
                  </span>
                </div>
<<<<<<< HEAD
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
=======

                <p className="text-[12px] text-zinc-400 mb-4">{item.description}</p>

                <div className="grid md:grid-cols-2 gap-3 text-xs text-zinc-400">
                  <p>Submitted: {item.submittedAt ? new Date(item.submittedAt).toLocaleString() : "Not submitted"}</p>
                  <p>Past due: {item.isPastDue ? "Yes" : "No"}</p>
                  <p>Attachment: {item.submissionAttachmentName || "None"}</p>
                  <p>Feedback: {item.feedback || "No feedback yet"}</p>
                </div>

                {canSubmit && (
                  <div className="mt-6 border border-zinc-700/60 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-white mb-3">Submit Assignment</h3>

                    <label className="block text-xs text-zinc-300 mb-2">Answer (optional)</label>
                    <textarea
                      value={draft.answer}
                      onChange={(e) => setDraftValue(item.assignmentId, { answer: e.target.value })}
                      placeholder="Write your answer..."
                      rows={4}
                      className="w-full rounded-lg bg-transparent border border-zinc-600 px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
                    />

                    <label className="block text-xs text-zinc-300 mt-4 mb-2">Attachment (optional)</label>
                    <input
                      type="file"
                      onChange={(e) => setDraftValue(item.assignmentId, { file: e.target.files?.[0] || null })}
                      className="w-full text-xs text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white hover:file:bg-blue-700"
                    />
                    {draft.file && <p className="mt-2 text-xs text-zinc-400">Selected: {draft.file.name}</p>}

                    {submitState?.text && (
                      <p className={`mt-3 text-xs ${submitState.type === "error" ? "text-red-300" : submitState.type === "success" ? "text-green-300" : "text-zinc-300"}`}>
                        {submitState.text}
                      </p>
                    )}

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleSubmitAssignment(item)}
                        disabled={isSubmitting}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
    </main>
  );
}
