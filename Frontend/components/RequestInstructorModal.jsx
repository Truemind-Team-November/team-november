"use client";
import { useState } from "react";
import client from "@/lib/client";

export default function RequestInstructorModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({ bio: "", expertise: "" });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                bio: formData.bio,
                expertise: formData.expertise,
                discipline: formData.discipline
            };

            await client.post("/role/request-instructor", payload);
            onSuccess();
            onClose();
        } catch (err) {
            // Log the error for your own debugging
            console.error("Submission Error:", err.response?.data);

            // Extract the message from the backend response
            const errorMessage = err.response?.data?.message || "An unexpected error occurred.";

            // Handle the specific "Pending Request" scenario with a cleaner alert or toast
            if (errorMessage.includes("already have a pending")) {
                alert("Application Pending: You've already submitted a request. Please wait for the admin to review it.");
            } else {
                alert(errorMessage);
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1a1a2e] border border-slate-400 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-1">Apply as Instructor</h3>
                <p className="text-xs text-zinc-400 mb-6">Transition your role by sharing your expertise.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1 tracking-wider">Bio</label>
                        <textarea
                            required
                            className="w-full bg-white/5 border border-slate-400 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Briefly describe your background..."
                            rows="3"
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1 tracking-wider">Expertise</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-white/5 border border-slate-400 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="e.g. Next.js, Backend Engineering"
                            onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-400 text-zinc-400 text-xs font-bold hover:bg-white/5 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
                            {loading ? "Submitting..." : "Send Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}