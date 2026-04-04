import CourseCard from "@/components/CourseCard";
import { DarkSunIcon, LightningIcon, PaletteIcon } from "@/components/Icons";
import Link from "next/link";

export default function CourseCatalog() {
  const courses = [
    {
      title: "UI/UX Fundamentals",
      category: "UI/UX DESIGN",
      description:
        "Learn the core principles of user interface design and experience from scratch",
      lessons: 12,
      duration: "-6h",
      author: "Emeka Obi",
      initials: "EO",
      bgColor: "bg-[#9db1d6]",
      status: "Enrolled",
      icon: <PaletteIcon className="w-12.5 h-12.5" />,
      progress: 55,
    },
    {
      title: "Product Thinking",
      category: "PRODUCT MANAGEMENT",
      description:
        "Understand how to think like a product manager and solve user problems effectively",
      lessons: 8,
      duration: "-6h",
      author: "Segun Obe",
      initials: "SO",
      bgColor: "bg-[#3a4468]",
      status: "Enrolled",
      icon: <DarkSunIcon className="w-12.5 h-12.5" />,
      progress: 30,
    },
    {
      title: "Agile & Scrum Mastery",
      category: "ENGINEERING",
      description:
        "Master modern agile methodologies and learn to ship products fast and collaboratively",
      lessons: 10,
      duration: "-5h",
      author: "Tunde Ige",
      initials: "TI",
      bgColor: "bg-[#e6a8ff]",
      status: "New",
      icon: <LightningIcon className="w-12.5 h-12.5" />,
    },
    {
      title: "Data-Driven Decision Making",
      category: "DATA SCIENCE",
      description:
        "Use data to drive product decisions, identify trends and validate hypothesis",
      lessons: 15,
      duration: "-5h",
      author: "Ife Babs",
      initials: "IB",
      bgColor: "bg-[#1a6b46]",
      icon: "📊",
    },
    {
      title: "Communications & Presentation",
      category: "SOFT SKILLS",
      description:
        "Build confidence, clarity, and storytelling skills for professional settings",
      lessons: 6,
      duration: "-5h",
      author: "Herny Jaji",
      initials: "HJ",
      bgColor: "bg-[#2a4e21]",
      icon: "🎤",
    },
    {
      title: "Building APIs With Node.js",
      category: "BACKEND DEVELOPMENT",
      description:
        "Develop powerful systems and APIs that run behind the scenes",
      lessons: 10,
      duration: "-5h",
      author: "Adeola Kore",
      initials: "AK",
      bgColor: "bg-[#fb7c56]",
      icon: "🧩",
    },
    {
      title: "Design Principles",
      category: "GRAPHICS DESIGN",
      description: "Learn to create stunning visuals and user friendly designs",
      lessons: 10,
      duration: "-9h",
      author: "Samuel Moon",
      initials: "SM",
      bgColor: "bg-[#f5e642]",
      icon: "✨",
    },
    {
      title: "HTML & CSS Fundamentals",
      category: "FRONTEND DEVELOPMENT",
      description: "Build responsive and interactive user interfaces for web",
      lessons: 11,
      duration: "-8h",
      author: "Aaron Akor",
      initials: "AA",
      bgColor: "bg-[#2ec4b6]",
      icon: "🖥️",
    },
    {
      title: "Git & Version Control",
      category: "ENGINEERING",
      description:
        "Learn how to collaborate on code using Git, Github, and branching strategies",
      lessons: 13,
      duration: "-5h",
      author: "Olumide Obe",
      initials: "OO",
      bgColor: "bg-[#f4a5b8]",
      icon: "🔒",
    },
  ];

  const tabs = [
    "All courses",
    "Design",
    "Engineering",
    "Product",
    "Data Science",
    "Business",
  ];

  return (
    <main className="min-h-screen bg-[#0f172a] p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Course Catalog</h1>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center justify-between border-b border-white/10 mb-8">
        <div className="flex gap-1">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-3 text-sm font-medium transition-colors duration-150
                ${
                  i === 0
                    ? "text-white border-b-2 border-blue-400 -mb-px"
                    : "text-slate-400 hover:text-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* My Courses link */}
        <button className="flex items-center gap-1.5 text-slate-300 text-sm font-medium hover:text-white transition-colors mb-2">
          <span className="text-blue-400">▶</span>
          My Courses
        </button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <Link key={index}  href={"/lesson"}>
            <CourseCard course={course} />
          </Link>
        ))}
      </div>
    </main>
  );
}
