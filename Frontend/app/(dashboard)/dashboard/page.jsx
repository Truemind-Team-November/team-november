"use client";
import { useState, useEffect } from "react";
import { ThemeColors } from "@/components/ThemeColors";
import client from "@/lib/client";

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [learningCourses, setLearningCourses] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [activity, setActivity] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [identityCard, setIdentityCard] = useState({
    fullName: "",
    publicId: "",
    discipline: "",
    cohortLabel: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileResponse = await client.get("/Profile/me");
        const profile = profileResponse.data?.data;

        if (profile) {
          const name = profile.fullName || "User";
          setUserName(name);

          const personalInformation = profile.personalInformation || {};
          const learningSummary = profile.learningSummary || {};

          setStats([
            {
              icon: "📚",
              title: "Courses Enrolled",
              value: String(learningSummary.courses ?? 0),
              statIcon: "↑",
              statText: "Active courses",
              statColor: "text-blue-500",
            },
            {
              icon: "✅",
              title: "Avg Completion",
              value: `${Math.round(learningSummary.averageProgress ?? 0)}%`,
              statIcon: "↑",
              statText: "Progress updated",
              statColor: "text-blue-500",
            },
            {
              icon: "🗒️",
              title: "Pending Tasks",
              value: String(learningSummary.pendingTasks ?? 0),
              statText: "Due this week",
              statColor: "text-red-500",
            },
            {
              icon: "🏆",
              title: "Certificates",
              value: String(learningSummary.certificates ?? 0),
              statText: "Completed courses",
              statColor: "text-blue-500",
            },
          ]);

          const discipline = personalInformation.discipline || "";
          const cohortLabel = personalInformation.cohortLabel || "";
          setIdentityCard({
            fullName: profile.fullName || name,
            publicId: profile.publicId || "",
            discipline,
            cohortLabel,
          });

          const tryDashboardResponse = await client
            .get("/Dashboard/me")
            .catch(() => null);
          const payload = tryDashboardResponse?.data?.data;

          if (
            payload?.continueLearning &&
            Array.isArray(payload.continueLearning) &&
            payload.continueLearning.length
          ) {
            setLearningCourses(
              payload.continueLearning.slice(0, 3).map((course, index) => ({
                emoji: index % 3 === 0 ? "⏰" : index % 3 === 1 ? "🖥️" : "📊",
                title: course.courseTitle,
                lesson: `Instructor: ${course.instructorName}`,
                access: course.lastActivityAt
                  ? `Last accessed ${new Date(course.lastActivityAt).toLocaleString()}`
                  : "Not started yet",
                progress: `${Math.round(course.progressPercentage || 0)}%`,
                btn:
                  Number(course.progressPercentage || 0) > 0
                    ? "Resume"
                    : "Start",
              })),
            );
          }

          if (
            payload?.upcomingDeadlines &&
            Array.isArray(payload.upcomingDeadlines) &&
            payload.upcomingDeadlines.length
          ) {
            setDeadlines(
              payload.upcomingDeadlines.slice(0, 3).map((item) => {
                const due = item.dueDate ? new Date(item.dueDate) : null;
                return {
                  date: due
                    ? `${String(due.getDate()).padStart(2, "0")} ${due.toLocaleString(undefined, { month: "short" }).toUpperCase()}`
                    : "N/A",
                  title: item.assignmentTitle,
                  course: item.courseTitle,
                  status: `${item.daysRemaining}d left`,
                };
              }),
            );
          }

          if (
            payload?.recentActivity &&
            Array.isArray(payload.recentActivity) &&
            payload.recentActivity.length
          ) {
            const dots = ["🟢", "🔵", "🟠", "🟣"];
            setActivity(
              payload.recentActivity.slice(0, 4).map((item, index) => ({
                text: item.description,
                time: item.occurredAt
                  ? new Date(item.occurredAt).toLocaleString()
                  : "Recently",
                dot: dots[index % dots.length],
              })),
            );
          }

          if (payload?.myTeam?.teamName) {
            setTeamName(payload.myTeam.teamName);
          }

          if (
            Array.isArray(payload?.myTeam?.members) &&
            payload.myTeam.members.length
          ) {
            setTeamMembers(
              payload.myTeam.members.slice(0, 4).map((member) => ({
                fullName: member.fullName,
                isCurrentUser: member.isCurrentUser,
              })),
            );
          }
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserName(user.fullName || "");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <main className="">
      <section
        style={{ backgroundColor: ThemeColors.bgBlue }}
        className="flex-1 min-h-screen text-zinc-300 font-sans p-4 md:p-8 overflow-y-auto"
      >
        {/* Header with Dynamic Name */}
        <div className="flex md:items-center justify-between mb-5 px-2 max-md:flex-col max-md:gap-5">
          <div>
            <h1 className="text-[22px] font-bold text-white leading-tight">
              Good morning,
            </h1>
            <h2 className="text-[22px] font-bold text-white leading-tight">
              {loading ? "Loading..." : userName || "Welcome"}
            </h2>
          </div>
          <div className="flex items-center gap-3 ">
            <span className="text-[18px] font-semibold text-white">
              Cohort 3. Week 6
            </span>
            <button className="flex items-center justify-center w-8 h-8 bg-[#161b22] border border-slate-400 rounded-md text-[14px]">
              🔔
            </button>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-[14px]">
              {getInitials(userName)}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 grid-cols-2 gap-3 mb-5">
          {loading ? (
            <div className="col-span-full rounded-xl border border-slate-400 p-4 text-sm text-zinc-400">
              Loading dashboard data...
            </div>
          ) : stats.length === 0 ? (
            <div className="col-span-full rounded-xl border border-slate-400 p-4 text-sm text-zinc-400">
              No summary data available.
            </div>
          ) : (
            stats.map((s, i) => (
              <div key={i} className="border border-slate-400 rounded-xl p-3.5">
                <div className="text-sm mb-2 p-1 rounded-sm bg-gray-200/30 w-fit">
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
                  {s.statIcon && (
                    <span className="text-[8px]">{s.statIcon}</span>
                  )}
                  {s.statText}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="grid md:grid-cols-[1.6fr_1fr] gap-4">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4">
            <section className="border border-slate-400 rounded-xl md:p-4 p-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-white">
                  Continue Learning
                </h3>
                <button className="px-5 py-2 text-white text-[11px] rounded-lg font-semibold bg-stone-600/80">
                  View all
                </button>
              </div>
              <div className="space-y-2.5">
                {!loading && learningCourses.length === 0 ? (
                  <p className="text-sm text-zinc-400">
                    No courses to continue yet.
                  </p>
                ) : (
                  learningCourses.map((c, i) => (
                    <div
                      key={i}
                      className="border border-slate-400 rounded-xl p-3.5 flex items-center justify-between max-md:flex-col max-md:gap-3"
                    >
                      <div className="flex items-center gap-3.5 w-full">
                        <div className="min-w-15 h-15 bg-gray-200 rounded-xl flex items-center justify-center text-[22px]">
                          {c.emoji}
                        </div>
                        <div className="w-full">
                          <h4 className="text-base font-bold text-white mb-0.5">
                            {c.title}
                          </h4>
                          <p className="text-sm text-zinc-400 mb-1.5">
                            {c.lesson}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-blue-600">{c.access}</p>
                            <span className="text-[10px] text-zinc-400">
                              {c.progress}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mt-2">
                            <div
                              className="h-full bg-blue-300"
                              style={{ width: c.progress }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <button className="px-4.5 py-2 bg-stone-600/80 text-white text-[11px] rounded-lg font-semibold max-md:w-full ml-4">
                        {c.btn}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className=" border border-slate-400 rounded-xl p-4">
              <h3 className="text-[14px] font-bold text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3.5 relative pl-2.5">
                {!loading && activity.length === 0 ? (
                  <p className="text-sm text-zinc-400">
                    No recent activity yet.
                  </p>
                ) : (
                  activity.map((a, i) => (
                    <div
                      key={i}
                      className="flex gap-3 relative z-10 border-b border-gray-600 pb-3"
                    >
                      <span className="text-[12px] -ml-1.5">{a.dot}</span>
                      <div>
                        <p className="text-[11px] text-zinc-400 leading-normal">
                          {a.text}
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">
                          {a.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            <section className="border border-slate-400 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⏱️</span>
                <h3 className="text-xl font-bold text-white">
                  Upcoming Deadlines
                </h3>
              </div>
              <div className="space-y-2.5">
                {!loading && deadlines.length === 0 ? (
                  <p className="text-sm text-zinc-400">
                    No upcoming deadlines.
                  </p>
                ) : (
                  deadlines.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-b border-gray-600 py-3 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-300 rounded-lg p-1.5 text-center min-w-12.5">
                          <p className="text-sm font-bold text-white leading-none">
                            {d.date.split(" ")[0]}
                          </p>
                          <p className="text-[10px] text-blue-700 mt-1 uppercase">
                            {d.date.split(" ")[1]}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white mb-1">
                            {d.title}
                          </p>
                          <p className="text-xs text-zinc-400">{d.course}</p>
                        </div>
                      </div>
                      <span className="text-[9px] text-white font-bold bg-red-500 px-2 py-0.75 rounded-md">
                        {d.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className=" border border-slate-400 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">My Team</h3>
                <button className="text-white text-[11px] font-bold bg-[#30363d] px-3 py-1.25 rounded-lg border border-zinc-700">
                  View
                </button>
              </div>
              <div className="bg-blue-300/20 w-fit rounded-lg px-3 py-1.5 mb-3 border border-blue-300/30">
                <p className="text-xs font-bold text-blue-300">
                  {teamName || "No team assigned yet"}
                </p>
              </div>
              <div className="space-y-3 px-1">
                {!loading && teamMembers.length === 0 ? (
                  <p className="text-sm text-zinc-400">
                    No team members available.
                  </p>
                ) : (
                  teamMembers.map((member, i) => (
                    <div
                      key={`${member.fullName}-${i}`}
                      className="flex items-center gap-2 text-[11px] text-zinc-400"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] ${member.isCurrentUser ? "bg-blue-600" : i % 2 ? "bg-green-500" : "bg-purple-500"}`}
                      >
                        {member.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <p>
                        {member.isCurrentUser
                          ? `${member.fullName} (You)`
                          : member.fullName}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="border border-slate-400 rounded-xl p-6 text-center bg-white/5">
              <p className="text-[10px] font-bold text-slate-400 tracking-[2px] mb-2.5 uppercase">
                TrueMinds Innovation
              </p>
              <p className="text-xl font-black text-blue-500 tracking-tight mb-1.5">
                {identityCard.publicId || "-"}
              </p>
              <p className="text-lg font-bold text-white mb-1">
                {identityCard.fullName || userName || "-"}
              </p>
              <p className="text-xs text-zinc-500">
                {[identityCard.discipline, identityCard.cohortLabel]
                  .filter(Boolean)
                  .join(" ") || "-"}
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
