
"use client";
import { useState } from "react";
import Image from "next/image";
import client from "@/lib/client";
import Link from "next/link";

export default function Signup() {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    discipline: "UI/UX Design",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const errorKey = name.charAt(0).toUpperCase() + name.slice(1);
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrors({ ConfirmPassword: ["Passwords do not match!"] });
      setLoading(false);
      return;
    }

      try {
        console.log(formData);
        const response = await client.post('/auth/register', formData);
        setMessage("Registration Successful! Redirecting in 2 seconds...");
        setErrors({});
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          discipline: "UI/UX Design",
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error(error);
        setMessage("Registration failed. Please try again.");
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
      } finally {
        setLoading(false);
      }

  return (
    <section className="grid grid-cols-2 items-center min-h-dvh px-8">
    <section className="grid grid-cols-2 items-center min-h-dvh p-6">
      <div className="h-full border-r border-gray-500 pt-8">
        <div>
          <Image src={"/logo.svg"} alt="logo" width={500} height={500} className="w-20 h-20 mb-5" />
@@ -97,14 +98,13 @@
              <span className="text-white font-bold">Unique ID Assigned</span>
              <span className="text-[#7D7F82] mb-4">
                {" "}
                - every signup gets a permanent
                - every signup gets a permanent identifier
              </span>
              <br /> identifier
            </p>
          </div>
          <div className="flex flex-row mb-4 gap-2 items-center">
            <div className="p-2 bg-[#314568] rounded-xl">
              <Image src="/fill.png" alt="Logo" width={20} height={20} />
              <Image src="/fill.png" alt="Logo" width={100} height={100} className="w-5 h-5" />
            </div>
            <p>
              <span className="text-white font-bold">Team Placement</span>
@@ -204,63 +204,69 @@
                className={`w-full border ${errors.Discipline ? 'border-red-500' : 'border-gray-300'} bg-transparent text-white text-sm rounded-lg px-3 py-2.5 outline-none appearance-none cursor-pointer`}
              <select>
                <option value="UI/UX Design" className="text-black">UI/UX Design</option>
                <option value="Software Development" className="text-black">Software Development</option>
                <option value="Product Management" className="text-black">Product Management</option>
                <option value="Front-end Engineering" className="text-black">Front-end Engineering</option>
                <option value="Back-end Engineering" className="text-black">Back-end Engineering</option>
                <option value="Mobile Development" className="text-black">Mobile Development</option>
                <option value="Data Analysis" className="text-black">Data Analysis</option>
                <option value="Digital Marketing" className="text-black">Digital Marketing</option>
                <option value="Content Strategy" className="text-black">Content Strategy</option>
                <option value="DevOps" className="text-black">DevOps</option>
                <option value="QA Engineering" className="text-black">QA Engineering</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-[#8b949e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.Discipline && (
              <p className="text-red-500 text-xs mt-1">{errors.Discipline[0]}</p>
            )}
          </div>

          {/* ── Password ── */}
          <div className="mb-4">
            <label className="text-white text-sm font-semibold block mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              className={`w-full border ${errors.Password ? 'border-red-500' : 'border-gray-300'} bg-transparent text-white text-sm rounded-lg px-3 py-2.5 outline-none`}
              required
            />
            {errors.Password && (
              <p className="text-red-500 text-xs mt-1">{errors.Password[0]}</p>
            )}
          </div>

          {/* ── Confirm Password ── */}
          <div className="mb-6">
            <label className="text-white text-sm font-semibold block mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className={`w-full border ${errors.ConfirmPassword ? 'border-red-500' : 'border-gray-300'} bg-transparent text-white text-sm rounded-lg px-3 py-2.5 outline-none`}
              required
            />
            {errors.ConfirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.ConfirmPassword[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "Registering..." : "Get Started"}
          </button>
        </form>
      </div>
    </section>
  );
}