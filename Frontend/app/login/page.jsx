"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import client from "@/lib/client";
import { GoogleLogin } from "@react-oauth/google";

const storeAuthSession = (payload) => {
  if (!payload?.token) return;

  localStorage.setItem("token", payload.token);
  localStorage.setItem("userName", payload.firstName || "");
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      fullName: [payload.firstName, payload.lastName].filter(Boolean).join(" "),
      email: payload.email,
      role: payload.role,
      teamId: payload.teamId,
      teamName: payload.teamName,
      publicId: payload.publicId,
      discipline: payload.discipline,
    })
  );
};

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await client.post("/auth/login", formData);
      const authPayload = response.data?.data;

      if (response.data.success && authPayload?.token) {
        storeAuthSession(authPayload);
        setMessage("Login successful! Redirecting...");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await client.post("/Auth/google", {
        idToken: credentialResponse.credential,
      });

      if (response.data.success) {
        storeAuthSession(response.data.data);
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Backend Error:", error.response?.data);
      setMessage(error.response?.data?.message || "Google Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 rounded-2xl overflow-hidden">
        <div className="p-10 text-white border-r border-gray-500 hidden md:block">
          <Image src="/logo.svg" alt="logo" width={500} height={500} className="w-20 h-20 mb-5" />
          <h1 className="text-4xl font-bold mb-3">
            Start Your <br /> <span className="text-[#0950C3]">Journey</span> Today
          </h1>
          <p className="mt-4 text-gray-400 text-sm">
            TrueMinds innovation’s unified learning platform for 50+ interns across all disciplines.
          </p>

          <div className="mt-10 space-y-5 text-sm">
            {[
              { icon: "/logo1.png", title: "Structured Courses", desc: "Access curated learning paths" },
              { icon: "/logo2.png", title: "Progress Tracking", desc: "See your growth in real life" },
              { icon: "/logo3.png", title: "Earn Certificates", desc: "on 100% course completion" },
              { icon: "/logo4.png", title: "Team Collaboration", desc: "Work with cross functional team" },
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <Image width={20} height={20} alt="icon" src={feature.icon} className="w-5 h-5 mt-1" />
                <p>
                  <span className="font-semibold">{feature.title}</span>
                  <span className="text-gray-400"> - {feature.desc}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-10 text-white">
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="text-sm text-gray-400 mt-1">
            New to TalentFlow?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Create an account
            </Link>
          </p>

          {message && (
            <div className={`mt-4 p-3 rounded text-sm ${message.includes("success") ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@trueminds.ng"
                className="w-full mt-2 p-3 rounded-lg bg-transparent border border-gray-600 focus:outline-none focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full mt-2 p-3 rounded-lg bg-transparent border border-gray-600 focus:outline-none focus:border-blue-500 transition-all"
                required
              />
              <div className="text-right mt-2">
                <Link href="/forgot-password" className="text-blue-500 text-sm hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <hr className="flex-1 border-gray-600" />
              or continue with
              <hr className="flex-1 border-gray-600" />
            </div>

            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setMessage("Google Login Failed")}
                useOneTap
                theme="filled_blue"
                shape="rectangular"
                width="100%"
              />
            </div>

            <button
              type="button"
              className="w-full bg-gray-700 py-3 rounded-lg opacity-70 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Image width={20} height={20} alt="sos" src="/sos.png" className="w-5 h-5" />
              SOS LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}