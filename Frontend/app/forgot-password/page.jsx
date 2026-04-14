"use client";
<<<<<<< HEAD
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import client from "@/lib/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
=======

import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
<<<<<<< HEAD
    setMessage("");
    setSuccess(false);

    try {
      const response = await client.post('/auth/forgot-password', { email });
      setMessage("Password reset link sent to your email. Please check your inbox.");
      setSuccess(true);
      setEmail("");
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred. Please try again.");
      }
=======
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
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image 
            src={"/logo.svg"} 
            alt="logo" 
            width={500} 
            height={500} 
            className="w-16 h-16 mx-auto mb-4" 
          />
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-400 text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {message && (
          <div 
            className={`mb-6 p-3 rounded text-sm ${
              success 
                ? "bg-green-900/30 text-green-400 border border-green-800" 
                : "bg-red-900/30 text-red-400 border border-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-white block mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@trueminds.ng"
              className="w-full p-3 rounded-lg bg-transparent border border-gray-600 focus:outline-none focus:border-blue-500 transition-all text-white"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-white"
=======
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
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

<<<<<<< HEAD
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Remember your password?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
=======
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
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
