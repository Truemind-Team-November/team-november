"use client";

import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("https://team-november.onrender.com/api/Auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });
    console.log(res)        

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSuccess("Check your email for reset link 📩");
      setEmail("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1220] to-[#0E1A2B] px-4">
      <div className="w-full max-w-md bg-[#111827] p-8 rounded-2xl shadow-2xl border border-gray-800">
        
        <h1 className="text-2xl font-bold text-white mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-400 mb-6">
          Enter your email to receive a reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full p-3 rounded-lg bg-[#1F2937] text-white outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg text-white font-semibold"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {success && (
          <p className="text-green-400 mt-4 text-sm">{success}</p>
        )}
        {error && (
          <p className="text-red-400 mt-4 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}