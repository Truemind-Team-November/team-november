"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeColors } from "@/components/ThemeColors";
import client from "@/lib/client";
import RequestInstructorModal from "@/components/RequestInstructorModal";

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("Learner");
  const [loading, setLoading] = useState(true);
  const [userDiscipline, setUserDiscipline] = useState("General Track");
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [courses, setCourses] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userBadges, setUserBadges] = useState([]);
  const [learnerData, setLearnerData] = useState(null);
  const [identityCard, setIdentityCard] = useState({
    fullName: "User",
    publicId: "TF-2026-000",
    discipline: "Intern",
    cohortLabel: "Cohort 3",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileRes = await client.get("/Profile/me");
        const profile = profileRes.data?.data;

        if (!profile) {
          router.push("/signup");
          return;
        }

        const role = profile.role || "Learner";
        const name = profile.fullName || "User";
        const discipline =
          profile.personalInformation?.discipline || "General Track";

        setUserName(name);
        setUserRole(role);
        setUserDiscipline(discipline);
        setUserBadges(profile.badges || []);
        setLearnerData(profile);

        let endpoint = "/Dashboard/me";
        if (role === "Instructor") endpoint = "/Dashboard/instructor";
        if (role === "Admin") endpoint = "/Dashboard/admin";

        let payload = null;
        try {
          const dashRes = await client.get(endpoint);
          payload = dashRes.data?.data;
        } catch (apiErr) {
          console.warn("Dashboard API unavailable, using fallback data.");
        }

        if (role === "Admin" && payload?.metrics) {
          const m = payload.metrics;
          setStats([
            {
              icon: "👥",
              title: "Total Learners",
              value: String(m.totalLearners ?? 0),
              statIcon: "↑",
              statText: "Active",
              statColor: "text-blue-500",
            },
            {
              icon: "👨‍🏫",
              title: "Instructors",
              value: String(m.totalInstructors ?? 0),
              statText: "Verified",
              statColor: "text-emerald-500",
            },
            {
              icon: "📚",
              title: "Total Courses",
              value: String(m.totalCourses ?? 0),
              statText: "Assigned",
              statColor: "text-blue-500",
            },
            {
              icon: "🛡️",
              title: "Pending Requests",
              value: String(m.pendingInstructorRequests ?? 0),
              statText: "Review needed",
              statColor:
                m.pendingInstructorRequests > 0
                  ? "text-red-500"
                  : "text-blue-500",
            },
          ]);
          setActivities(payload.recentActivity || []);
        } else if (role === "Instructor") {
          const m = payload?.metrics || {
            totalLearners: 0,
            pendingGrading: 0,
            totalCourses: 0,
            totalSubmissions: 0,
          };
          setStats([
            {
              icon: "👨‍🏫",
              title: "Total Learners",
              value: String(m.totalLearners ?? 0),
              statIcon: "↑",
              statText: "Active",
              statColor: "text-blue-500",
            },
            {
              icon: "📝",
              title: "Pending Grading",
              value: String(m.pendingGrading ?? 0),
              statIcon: "!",
              statText: "Review needed",
              statColor: "text-red-500",
            },
            {
              icon: "📚",
              title: "Total Courses",
              value: String(m.totalCourses ?? 0),
              statText: "Assigned",
              statColor: "text-blue-500",
            },
            {
              icon: "📤",
              title: "Total Submissions",
              value: String(m.totalSubmissions ?? 0),
              statText: "Total received",
              statColor: "text-blue-500",
            },
          ]);
          setCourses(payload?.courses || []);
          setPendingReviews(payload?.pendingReviews || []);
          setActivities(payload?.recentActivity || []);
        } else if (role === "Learner" && payload) {
          const ls = profile.learningSummary || {};
          setStats([
            {
              icon: "📚",
              title: "Courses",
              value: String(ls.courses ?? 0),
              statIcon: "↑",
              statText: "Enrolled",
              statColor: "text-blue-500",
            },
            {
              icon: "✅",
              title: "Progress",
              value: `${Math.round(ls.averageProgress ?? 0)}%`,
              statIcon: "↑",
              statText: "Average",
              statColor: "text-blue-500",
            },
            {
              icon: "🗒️",
              title: "Tasks",
              value: "3",
              statText: "Pending",
              statColor: "text-red-500",
            },
            {
              icon: "🏆",
              title: "Certificates",
              value: String(ls.certificates ?? 0),
              statText: "Earned",
              statColor: "text-blue-500",
            },
          ]);
        }

        setIdentityCard({
          fullName: name,
          publicId: profile.publicId || "TF-2026-ID",
          discipline: discipline,
          cohortLabel: profile.personalInformation?.cohortLabel || "Cohort 3",
        });
      } catch (err) {
        console.error("Dashboard Error:", err);
        if (err.response?.status === 401) router.push("/signup");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Just now";
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return past.toLocaleDateString();
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  const formatTime = (isoString) =>
    new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div
        style={{ backgroundColor: ThemeColors.bgBlue }}
        className="min-h-screen flex items-center justify-center text-white font-sans"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="animate-pulse font-medium tracking-wide">
            Initializing dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <main>
      <section
        style={{ backgroundColor: ThemeColors.bgBlue }}
        className="flex-1 min-h-screen text-zinc-300 font-sans p-4 md:p-8 overflow-y-auto"
      >
        {/* Header */}
        <div className="flex md:items-center justify-between mb-5 px-2 max-md:flex-col max-md:gap-5">
          <div>
            <h1 className="text-[22px] font-bold text-white leading-tight">
              Welcome,
            </h1>
            <h2 className="text-[22px] font-bold text-white leading-tight">
              {userName}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-[14px]">
              {getInitials(userName)}
            </div>
          </div>
        </div>

        {/* Top Metrics Grid */}
        <div className="grid md:grid-cols-4 grid-cols-2 gap-3 mb-5">
          {stats.map((s, i) => (
            <div
              key={i}
              className="border border-slate-400 rounded-xl p-3.5 bg-white/5 shadow-sm"
            >
              <div className="text-sm mb-2 p-1 rounded-sm bg-gray-200/10 w-fit">
                {s.icon}
              </div>
              <div className="text-[26px] font-bold text-white mb-0.5">
                {s.value}
              </div>
              <div className="text-[11px] text-zinc-400 font-medium mb-2">
                {s.title}
              </div>
              <div
                className={`flex items-center gap-1 ${s.statColor} text-[10px] font-medium`}
              >
                {s.statIcon && <span className="text-[8px]">{s.statIcon}</span>}
                {s.statText}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-[1.6fr_1fr] gap-4">
          <div className="flex flex-col gap-4">
            <section className="border border-slate-400 rounded-xl md:p-4 p-2 bg-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-white">
                  {userRole === "Admin"
                    ? "User Management"
                    : userRole === "Instructor"
                      ? "Course Management"
                      : "Continue Learning"}
                </h3>
                <button className="px-5 py-2 text-white text-[11px] rounded-lg font-semibold bg-stone-600/80 hover:bg-stone-600 transition-colors">
                  View all
                </button>
              </div>

              <div className="space-y-2.5">
                {userRole === "Instructor" ? (
                  courses.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic px-1">
                      No courses assigned yet.
                    </p>
                  ) : (
                    courses.slice(0, 3).map((course) => (
                      <div
                        key={course.courseId}
                        className="border border-slate-400 rounded-xl p-3.5 flex items-center justify-between bg-white/5"
                      >
                        <div className="flex items-center gap-3.5 w-full">
                          <div className="min-w-12.5 h-12.5 bg-gray-200/20 rounded-xl flex items-center justify-center text-[22px]">
                            📂
                          </div>
                          <div className="w-full">
                            <h4 className="text-[13px] font-bold text-white mb-0.5">
                              {course.title}
                            </h4>
                            <p className="text-[11px] text-zinc-400">
                              {course.category}
                            </p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">
                              {course.learnerCount} learners •{" "}
                              {course.lessonCount} lessons •{" "}
                              {course.assignmentCount} assignments
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => router.push("/coursecatalog")}
                          className="shrink-0 px-3 py-1.5 bg-stone-600/80 text-white text-[10px] rounded-lg font-semibold ml-4 hover:bg-stone-600 transition-colors"
                        >
                          Manage
                        </button>
                      </div>
                    ))
                  )
                ) : (
                  <div className="space-y-3">
                    {userRole === "Admin" ? (
                      <>
                        <div
                          onClick={() => router.push("/users")}
                          className="border border-slate-400/30 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all hover:bg-white/5"
                        >
                          <div className="flex items-center gap-3.5 w-full">
                            <div className="min-w-12.5 h-12.5 bg-emerald-600/20 border border-emerald-500/30 rounded-xl flex items-center justify-center text-[20px]">
                              👥
                            </div>
                            <div className="w-full">
                              <h4 className="text-[15px] font-bold text-white mb-0.5">
                                User Management
                              </h4>
                              <p className="text-[12px] text-zinc-400">
                                View and manage all registered members
                              </p>
                            </div>
                          </div>
                          <div className="px-4 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 text-[10px] rounded-lg font-bold ml-4 whitespace-nowrap">
                            View All
                          </div>
                        </div>
                        <div
                          onClick={() => router.push("/role-requests")}
                          className="border border-slate-400/30 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all hover:bg-white/5"
                        >
                          <div className="flex items-center gap-3.5 w-full">
                            <div className="min-w-12.5 h-12.5 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center text-[20px]">
                              🛡️
                            </div>
                            <div className="w-full">
                              <h4 className="text-[15px] font-bold text-white mb-0.5">
                                Instructor Applications
                              </h4>
                              <p className="text-[12px] text-zinc-400">
                                Review pending role requests
                              </p>
                            </div>
                          </div>
                          <div className="px-4 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-600/30 text-[10px] rounded-lg font-bold ml-4 whitespace-nowrap">
                            Manage
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="border border-slate-400/30 rounded-xl p-3.5 flex items-center justify-between bg-white/5">
                        <div className="flex items-center gap-3.5 w-full">
                          <div className="min-w-15 h-15 bg-gray-200/20 rounded-xl flex items-center justify-center text-[22px]">
                            ⏰
                          </div>
                          <div className="w-full">
                            <h4 className="text-base font-bold text-white mb-0.5">{`${userDiscipline} Week 1`}</h4>
                            <p className="text-sm text-zinc-400">
                              Introduction to the Track
                            </p>
                          </div>
                        </div>
                        <button className="px-4.5 py-2 bg-stone-600/80 text-white text-[11px] rounded-lg font-semibold ml-4 hover:bg-stone-600 transition-colors">
                          Manage
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {userRole === "Learner" && (
              <section className="border border-slate-400 rounded-xl p-5 bg-linear-to-r from-blue-600/10 to-transparent">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      Become an Instructor
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Share your expertise and transition your role.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-all"
                  >
                    Apply Now
                  </button>
                </div>
              </section>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {userRole === "Admin" ? (
              <section className="border border-slate-400 rounded-xl p-4 bg-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">⚡</span>
                  <h3 className="text-xl font-bold text-white">
                    Recent Activity
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {activities.length > 0 ? (
                    activities.slice(0, 5).map((act, i) => (
                      <div
                        key={i}
                        className="flex flex-col border-b border-gray-600/50 py-3 last:border-0"
                      >
                        <p className="text-xs font-bold text-white mb-1">
                          {act.description}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          {formatTime(act.occurredAt)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-500 italic px-1">
                      No recent activity.
                    </p>
                  )}
                </div>
              </section>
            ) : (
              <section className="border border-slate-400 rounded-xl p-4 bg-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✍️</span>
                    <h3 className="text-[14px] font-bold text-white">
                      Pending Reviews
                    </h3>
                  </div>
                  {pendingReviews.length > 0 && (
                    <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {pendingReviews.length} pending
                    </span>
                  )}
                </div>

                {pendingReviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-2">
                    <span className="text-3xl">🎉</span>
                    <p className="text-xs text-zinc-400 font-medium">
                      All submissions graded!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {pendingReviews.slice(0, 3).map((review) => (
                      <div
                        key={review.submissionId}
                        className="border border-slate-600 rounded-xl p-3 bg-white/5 flex items-start justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[11px] font-bold shrink-0">
                            {review.learnerName
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[12px] font-bold text-white leading-tight">
                              {review.learnerName}
                            </p>
                            <p className="text-[10px] text-zinc-400 leading-tight mt-0.5">
                              {review.assignmentTitle}
                            </p>
                            <p className="text-[9px] text-zinc-500 mt-0.5">
                              {review.courseTitle} •{" "}
                              {new Date(review.submittedAt).toLocaleDateString(
                                [],
                                { month: "short", day: "numeric" },
                              )}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => router.push("/assignments")}
                          className="shrink-0 px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white text-[10px] font-semibold rounded-lg transition-colors"
                        >
                          Grade
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            <section className="border border-slate-400 rounded-xl p-6 text-center bg-white/5 shadow-inner relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
              <p className="text-[10px] font-bold text-slate-400 tracking-[2px] mb-2 uppercase">
                TRUEMINDS {userRole}
              </p>
              <p className="text-xl font-black text-blue-500 mb-1.5">
                {identityCard.publicId}
              </p>
              <p className="text-lg font-bold text-white mb-1">
                {identityCard.fullName}
              </p>
              <p className="text-xs text-zinc-500 mb-4">
                {identityCard.discipline} • {identityCard.cohortLabel}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {userBadges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-blue-600/20 border border-blue-500/30 text-[9px] font-bold text-blue-400 uppercase"
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
