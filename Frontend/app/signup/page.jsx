"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import client from "@/lib/client";

export default function Signup() {

  useEffect(() => {
    client.get('/health').catch(() => { });
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    discipline: "UI/UX Design", // default value matching your select
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Simple client-side check
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending data to backend:", formData);
      const response = await client.post('/auth/register', formData);
      setMessage("Registration Successful!");
      console.log(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#101723] text-white flex flex-row items-center justify-center min-h-screen p-6 gap-30">
      <div className="h-100 w-150">
        <div>
          <h1 className="text-4xl font-bold mb-3">
            Talent<span className="text-[#0950C3]">Flow</span> <br /> <br />{" "}
            Start Your
            <br /> <span className="text-[#0950C3]">Journey</span> Today
          </h1>
          <p className="text-[#7D7F82] mb-4">
            Join hundreds of interns building real world skills on TalentFlow
          </p>
        </div>
        <div className="w-125">
          <div className="flex flex-row mb-4 gap-2 items-center">
            <div className="p-2 bg-[#314568] rounded-xl">
              <Image src="/Group.png" alt="Logo" width={20} height={20} />
            </div>
            <p>
              <span className="text-white font-bold">Unique ID Assigned</span>
              <span className="text-[#7D7F82] mb-4">
                {" "}
                - every signup gets a permanent
              </span>
              <br /> identifier
            </p>
          </div>
          <div className="flex flex-row mb-4 gap-2 items-center">
            <div className="p-2 bg-[#314568] rounded-xl">
              <Image src="/fill.png" alt="Logo" width={20} height={20} />
            </div>
            <p>
              <span className="text-white font-bold">Team Placement</span>
              <span className="text-[#7D7F82] mb-4">
                {" "}
                - Auto-assigned to your <br />
                discipline team
              </span>
            </p>
          </div>
          <div className="flex flex-row mb-4 gap-2 items-center">
            <div className="p-2 bg-[#314568] rounded-xl">
              <Image src="/target.png" alt="Logo" width={20} height={20} />
            </div>
            <p>
              <span className="text-white font-bold">Role-Based Access</span>
              <span className="text-[#7D7F82] mb-4">
                {" "}
                - Personalized for Leaner, Mentor, <br />
                or Admin
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="min-h-screen flex items-start justify-start p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-sm"> {/* Wrap in <form> */}
          <h1 className="text-white text-3xl font-bold mb-1">Create Account</h1>

          {/* Status Message */}
          {message && <p className="text-sm my-2 text-blue-400">{message}</p>}

          <div className="flex gap-3 mb-4 mt-6">
            <div className="flex-1">
              <label className="text-white text-sm font-semibold block mb-2">First Name</label>
              <input
                type="text"
                name="firstName" // Add name attribute
                value={formData.firstName} // Bind value
                onChange={handleChange} // Bind handler
                placeholder="Adaeze"
                className="w-full border border-gray-300 bg-transparent text-white text-sm rounded-lg px-3 py-2.5 outline-none"
                required
              />
            </div>
            <div className="flex-1">
              <label className="text-white text-sm font-semibold block mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Okoro"
                className="w-full border border-gray-300 bg-transparent text-white text-sm rounded-lg px-3 py-2.5 outline-none"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-white text-sm font-semibold block mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@trueminds.ng"
              className="w-full border border-gray-300 bg-transparent text-white text-sm rounded-lg px-3 py-2.5 outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="text-white text-sm font-semibold block mb-2">Discipline</label>
            <div className="relative">
              <select
                name="discipline"
                value={formData.discipline}
                onChange={handleChange}
                className="w-full border border-gray-300 bg-transparent text-white text-sm rounded-lg px-3 py-2.5 outline-none appearance-none cursor-pointer"
              >
                <option value="UI/UX Design" className="text-black">UI/UX Design</option>
                <option value="Front-end Engineering" className="text-black">Front-end Engineering</option>
                <option value="Back-end Engineering" className="text-black">Back-end Engineering</option>
                <option value="Mobile Development" className="text-black">Mobile Development</option>
                <option value="Data Analysis" className="text-black">Data Analysis</option>
                <option value="Product Management" className="text-black">Product Management</option>
                <option value="Digital Marketing" className="text-black">Digital Marketing</option>
                <option value="Content Strategy" className="text-black">Content Strategy</option>
                <option value="DevOps" className="text-black">DevOps</option>
                <option value="QA Engineering" className="text-black">QA Engineering</option>
              </select>
              {/* chevron */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-[#8b949e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-white text-sm font-semibold block mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              className="w-full border border-gray-300 bg-transparent text-white text-sm rounded-lg px-3 py-2.5 outline-none"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="text-3xl ">
            Email Address
          </label>

          <input
            type="email"
            id="email"
            placeholder="Enter your email address"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
          />
        </div>
        <h2 className="text-3xl ">Discipline</h2>
        <div className="w-full h-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 flex flex-row-reverse items-center mb-8 ">
          <Image src="/dropdown.png" alt="Logo" width={40} height={40} />
        </div>
        <div className="mb-4">
          <label htmlFor="Password" className="text-3xl ">
            Password
          </label>

          <input
            type="password"
            id="Password"
            placeholder="Minimum 8 characters"
            required
            className="w-full h-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 mt-2"
          />
        </div>
        <button className="w-full h-10 bg-[#0950C3] text-white rounded-lg hover:bg-blue-600 transition-colors ">
          Get Started
        </button>
      </div>
    </section>
  );
}
