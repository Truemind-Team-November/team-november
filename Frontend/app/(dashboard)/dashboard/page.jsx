"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeColors } from '@/components/ThemeColors';
import client from "@/lib/client";
import RequestInstructorModal from "@/components/RequestInstructorModal";

export default function Dashboard() {
<<<<<<< HEAD
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([]);
    const [learningCourses, setLearningCourses] = useState([]);
    const [deadlines, setDeadlines] = useState([]);
    const [activity, setActivity] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [teamName, setTeamName] = useState('');
    const [identityCard, setIdentityCard] = useState({
        fullName: '',
        publicId: '',
        discipline: '',
        cohortLabel: '',
=======
    const router = useRouter();
    const [userName, setUserName] = useState("User");
    const [userRole, setUserRole] = useState("Learner");
    const [loading, setLoading] = useState(true);
    const [userDiscipline, setUserDiscipline] = useState('General Track');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [stats, setStats] = useState([]);
    const [activities, setActivities] = useState([]);
    const [userBadges, setUserBadges] = useState([]);
    const [learnerData, setLearnerData] = useState(null);
    const [identityCard, setIdentityCard] = useState({
        fullName: 'User',
        publicId: 'TF-2026-000',
        discipline: 'Intern',
        cohortLabel: 'Cohort 3',
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
    });

    const formatTimeAgo = (dateString) => {
        if (!dateString) return "Just now";
        const now = new Date();
        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return past.toLocaleDateString();
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch Profile to check authentication
                const profileRes = await client.get('/Profile/me');
                
                // If API returns success: false or missing data, redirect
                if (!profileRes.data?.success || !profileRes.data?.data) {
                    router.push("/signup");
                    return;
                }

                const profile = profileRes.data.data;
                const role = profile.role || 'Learner';
                const name = profile.fullName || 'User';
                const discipline = profile.personalInformation?.discipline || 'General Track';
                
                setUserName(name);
                setUserRole(role);
                setUserDiscipline(discipline);
                setUserBadges(profile.badges || []);
                setLearnerData(profile);

                // 2. Fetch Dashboard Metrics based on Role
                let endpoint = role === 'Admin' ? '/Dashboard/admin' : role === 'Instructor' ? '/Dashboard/instructor' : '/Dashboard/me';
                const dashRes = await client.get(endpoint);
                const payload = dashRes.data?.data;

<<<<<<< HEAD
                if (role === 'Admin' && payload?.metrics) {
                    const m = payload.metrics;
                    setStats([
<<<<<<< HEAD
                        { icon: '📚', title: 'Courses Enrolled', value: String(learningSummary.courses ?? 0), statIcon: '↑', statText: 'Active courses', statColor: 'text-blue-500' },
                        { icon: '✅', title: 'Avg Completion', value: `${Math.round(learningSummary.averageProgress ?? 0)}%`, statIcon: '↑', statText: 'Progress updated', statColor: 'text-blue-500' },
                        { icon: '🗒️', title: 'Pending Tasks', value: String(learningSummary.pendingTasks ?? 0), statText: 'Due this week', statColor: 'text-red-500' },
                        { icon: '🏆', title: 'Certificates', value: String(learningSummary.certificates ?? 0), statText: 'Completed courses', statColor: 'text-blue-500' },
                    ]);

                    const discipline = personalInformation.discipline || '';
                    const cohortLabel = personalInformation.cohortLabel || '';
                    setIdentityCard({
                        fullName: profile.fullName || name,
                        publicId: profile.publicId || '',
                        discipline,
                        cohortLabel,
                    });

                    const tryDashboardResponse = await client.get('/Dashboard/me').catch(() => null);
                    const payload = tryDashboardResponse?.data?.data;

                    if (payload?.continueLearning && Array.isArray(payload.continueLearning) && payload.continueLearning.length) {
                        setLearningCourses(payload.continueLearning.slice(0, 3).map((course, index) => ({
                            emoji: index % 3 === 0 ? '⏰' : index % 3 === 1 ? '🖥️' : '📊',
                            title: course.courseTitle,
                            lesson: `Instructor: ${course.instructorName}`,
                            access: course.lastActivityAt
                                ? `Last accessed ${new Date(course.lastActivityAt).toLocaleString()}`
                                : 'Not started yet',
                            progress: `${Math.round(course.progressPercentage || 0)}%`,
                            btn: Number(course.progressPercentage || 0) > 0 ? 'Resume' : 'Start',
                        })));
                    }

                    if (payload?.upcomingDeadlines && Array.isArray(payload.upcomingDeadlines) && payload.upcomingDeadlines.length) {
                        setDeadlines(payload.upcomingDeadlines.slice(0, 3).map((item) => {
                            const due = item.dueDate ? new Date(item.dueDate) : null;
                            return {
                                date: due
                                    ? `${String(due.getDate()).padStart(2, '0')} ${due.toLocaleString(undefined, { month: 'short' }).toUpperCase()}`
                                    : 'N/A',
                                title: item.assignmentTitle,
                                course: item.courseTitle,
                                status: `${item.daysRemaining}d left`,
                            };
                        }));
                    }

                    if (payload?.recentActivity && Array.isArray(payload.recentActivity) && payload.recentActivity.length) {
                        const dots = ['🟢', '🔵', '🟠', '🟣'];
                        setActivity(payload.recentActivity.slice(0, 4).map((item, index) => ({
                            text: item.description,
                            time: item.occurredAt ? new Date(item.occurredAt).toLocaleString() : 'Recently',
                            dot: dots[index % dots.length],
                        })));
                    }

                    if (payload?.myTeam?.teamName) {
                        setTeamName(payload.myTeam.teamName);
                    }

                    if (Array.isArray(payload?.myTeam?.members) && payload.myTeam.members.length) {
                        setTeamMembers(payload.myTeam.members.slice(0, 4).map((member) => ({
                            fullName: member.fullName,
                            isCurrentUser: member.isCurrentUser,
                        })));
                    }
=======
                        { icon: "👥", title: 'Total Users', value: String(m.totalUsers ?? 0), statIcon: "↑", statText: 'Platform Growth', statColor: 'text-blue-500' },
                        { icon: "🎓", title: 'Total Learners', value: String(m.totalLearners ?? 0), statIcon: "↑", statText: 'Active Students', statColor: 'text-blue-500' },
                        { icon: "👨‍🏫", title: 'Total Instructors', value: String(m.totalInstructors ?? 0), statText: 'Staff Count', statColor: 'text-blue-500' },
                        { icon: "📚", title: 'Total Courses', value: String(m.totalCourses ?? 0), statText: 'Published Tracks', statColor: 'text-blue-500' },
                    ]);
                    setActivities(payload.recentActivity || []);
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
                }
                else if (role === 'Instructor' && payload?.metrics) {
                    const m = payload.metrics;
                    setStats([
                        { icon: "👨‍🏫", title: 'Total Learners', value: String(m.totalLearners ?? 0), statIcon: "↑", statText: 'Active', statColor: 'text-blue-500' },
                        { icon: "📝", title: 'Pending Grading', value: String(m.pendingGrading ?? 0), statIcon: "!", statText: 'Review needed', statColor: 'text-red-500' },
                        { icon: "📚", title: 'Total Courses', value: String(m.totalCourses ?? 0), statText: 'Assigned', statColor: 'text-blue-500' },
                        { icon: "📤", title: 'Total Submissions', value: String(m.totalSubmissions ?? 0), statText: 'Total received', statColor: 'text-blue-500' },
                    ]);
                }
                else if (role === 'Learner' && payload) {
=======
                if (role === 'Learner') {
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
                    const ls = profile.learningSummary || {};
                    setStats([
                        { icon: '📚', title: 'Courses', value: String(ls.courses ?? 0), statIcon: '↑', statText: 'Enrolled', statColor: 'text-blue-500' },
                        { icon: '✅', title: 'Progress', value: `${Math.round(ls.averageProgress ?? 0)}%`, statIcon: '↑', statText: 'Average', statColor: 'text-blue-500' },
                        { icon: '🎯', title: 'Avg Score', value: `${Math.round(ls.averageScore ?? 0)}%`, statText: 'Academic', statColor: 'text-blue-500' },
                        { icon: '🏆', title: 'Certificates', value: String(ls.certificates ?? 0), statText: 'Earned', statColor: 'text-blue-500' },
                    ]);
                } else if (payload?.metrics) {
                    const m = payload.metrics;
                    if (role === 'Admin') {
                        setStats([
                            { icon: "👥", title: 'Total Learners', value: String(m.totalLearners ?? 0), statIcon: "↑", statText: 'Active', statColor: 'text-blue-500' },
                            { icon: "👨‍🏫", title: 'Instructors', value: String(m.totalInstructors ?? 0), statText: 'Verified', statColor: 'text-emerald-500' },
                            { icon: "📚", title: 'Total Courses', value: String(m.totalCourses ?? 0), statText: 'Assigned', statColor: 'text-blue-500' },
                            { icon: "🛡️", title: 'Pending Requests', value: String(m.pendingInstructorRequests ?? 0), statText: 'Review needed', statColor: m.pendingInstructorRequests > 0 ? 'text-red-500' : 'text-blue-500' },
                        ]);
                        setActivities(payload.recentActivity || []);
                    } else {
                        setStats([
                            { icon: "👨‍🏫", title: 'Total Learners', value: String(m.totalLearners ?? 0), statIcon: "↑", statText: 'Active', statColor: 'text-blue-500' },
                            { icon: "📝", title: 'Pending Grading', value: String(m.pendingGrading ?? 0), statText: 'Review needed', statColor: 'text-red-500' },
                            { icon: "📚", title: 'Total Courses', value: String(m.totalCourses ?? 0), statText: 'Assigned', statColor: 'text-blue-500' },
                            { icon: "📤", title: 'Submissions', value: String(m.totalSubmissions ?? 0), statText: 'Total', statColor: 'text-blue-500' },
                        ]);
                    }
                }

                setIdentityCard({
                    fullName: name,
                    publicId: profile.publicId || 'TF-2026-ID',
                    discipline: discipline,
                    cohortLabel: profile.personalInformation?.cohortLabel || 'Cohort 3',
                });

            } catch (err) {
<<<<<<< HEAD
<<<<<<< HEAD
                console.error("Dashboard fetch error:", err);
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    setUserName(user.fullName || "");
                }
=======
                console.error("Dashboard Error:", err);
                if (err.response?.status === 401) router.push("/signup");
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
=======
                console.error("Dashboard Auth Error:", err);
                // Redirect to signup on 401 or any fetch failure
                router.push("/signup");
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [router]);

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    if (loading) {
        return (
            <div style={{ backgroundColor: ThemeColors.bgBlue }} className="min-h-screen flex items-center justify-center text-white font-sans">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="animate-pulse font-medium tracking-wide text-sm">Verifying Session...</div>
                </div>
            </div>
        );
    }

    return (
        <main>
            <section style={{ backgroundColor: ThemeColors.bgBlue }} className="flex-1 min-h-screen text-zinc-300 font-sans p-4 md:p-8 overflow-y-auto">

                {/* Header */}
                <div className="flex md:items-center justify-between mb-5 px-2 max-md:flex-col max-md:gap-5">
                    <div>
<<<<<<< HEAD
                        <h1 className="text-[22px] font-bold text-white leading-tight">Good morning,</h1>
                        <h2 className="text-[22px] font-bold text-white leading-tight">
                            {loading ? "Loading..." : (userName || "Welcome")}
                        </h2>
=======
                        <h1 className="text-[22px] font-bold text-white leading-tight">Welcome,</h1>
                        <h2 className="text-[22px] font-bold text-white leading-tight">{userName}</h2>
<<<<<<< HEAD
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
=======
                        {/* {userRole === 'Learner' && learnerData?.headline && (
                            <p className="text-xs text-zinc-500 mt-1 italic">{learnerData.headline}</p>
                        )} */}
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-[14px]">
                            {getInitials(userName)}
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid md:grid-cols-4 grid-cols-2 gap-3 mb-5">
<<<<<<< HEAD
                    {loading ? (
                        <div className="col-span-full rounded-xl border border-slate-400 p-4 text-sm text-zinc-400">Loading dashboard data...</div>
                    ) : stats.length === 0 ? (
                        <div className="col-span-full rounded-xl border border-slate-400 p-4 text-sm text-zinc-400">No summary data available.</div>
                    ) : stats.map((s, i) => (
                        <div key={i} className="border border-slate-400 rounded-xl p-3.5">
                            <div className="text-sm mb-2 p-1 rounded-sm bg-gray-200/30 w-fit">{s.icon}</div>
=======
                    {stats.map((s, i) => (
                        <div key={i} className="border border-slate-400 rounded-xl p-3.5 bg-white/5 shadow-sm">
                            <div className="text-sm mb-2 p-1 rounded-sm bg-gray-200/10 w-fit">{s.icon}</div>
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
                            <div className="text-[26px] font-bold text-white mb-0.5">{s.value}</div>
                            <div className="text-[11px] text-zinc-400 font-medium mb-2">{s.title}</div>
                            <div className={`flex items-center gap-1 ${s.statColor} text-[10px] font-medium`}>
                                {s.statIcon && <span className="text-[8px]">{s.statIcon}</span>}
                                {s.statText}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-[1.6fr_1fr] gap-4">
                    <div className="flex flex-col gap-4">
                        <section className="border border-slate-400 rounded-xl md:p-4 p-2 bg-white/5">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="text-[14px] font-bold text-white">
                                    {userRole === 'Admin' ? "System Management" : userRole === 'Instructor' ? "Course Management" : "Continue Learning"}
                                </h3>
                            </div>
<<<<<<< HEAD
                            <div className="space-y-2.5">
                                {!loading && learningCourses.length === 0 ? (
                                    <p className="text-sm text-zinc-400">No courses to continue yet.</p>
                                ) : learningCourses.map((c, i) => (
                                    <div key={i} className="border border-slate-400 rounded-xl p-3.5 flex items-center justify-between max-md:flex-col max-md:gap-3">
                                        <div className="flex items-center gap-3.5 w-full">
                                            <div className="min-w-15 h-15 bg-gray-200 rounded-xl flex items-center justify-center text-[22px]">{c.emoji}</div>
                                            <div className='w-full'>
                                                <h4 className="text-base font-bold text-white mb-0.5">{c.title}</h4>
                                                <p className="text-sm text-zinc-400 mb-1.5">{c.lesson}</p>
                                                <div className='flex items-center justify-between'>
                                                    <p className="text-xs text-blue-600">{c.access}</p>
                                                    <span className="text-[10px] text-zinc-400">{c.progress}</span>
                                                </div>
                                                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mt-2">
                                                    <div className="h-full bg-blue-300" style={{ width: c.progress }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="px-4.5 py-2 bg-stone-600/80 text-white text-[11px] rounded-lg font-semibold max-md:w-full ml-4">
                                            {c.btn}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className=" border border-slate-400 rounded-xl p-4">
                            <h3 className="text-[14px] font-bold text-white mb-4">Recent Activity</h3>
                            <div className="space-y-3.5 relative pl-2.5">
                                {!loading && activity.length === 0 ? (
                                    <p className="text-sm text-zinc-400">No recent activity yet.</p>
                                ) : activity.map((a, i) => (
                                    <div key={i} className="flex gap-3 relative z-10 border-b border-gray-600 pb-3">
                                        <span className="text-[12px] -ml-1.5">{a.dot}</span>
                                        <div>
                                            <p className="text-[11px] text-zinc-400 leading-normal">{a.text}</p>
                                            <p className="text-[10px] text-zinc-500 mt-0.5">{a.time}</p>
=======

                            <div className="space-y-3">
                                {userRole === 'Admin' ? (
                                    <>
                                        <div onClick={() => router.push('/users')} className="border border-slate-400/30 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all hover:bg-white/5">
                                            <div className="flex items-center gap-3.5 w-full">
                                                <div className="min-w-[50px] h-[50px] bg-emerald-600/20 border border-emerald-500/30 rounded-xl flex items-center justify-center text-[20px]">👥</div>
                                                <div className='w-full'>
                                                    <h4 className="text-[15px] font-bold text-white mb-0.5">User Management</h4>
                                                    <p className="text-[12px] text-zinc-400">View and manage all registered members</p>
                                                </div>
                                            </div>
                                            <div className="px-4 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 text-[10px] rounded-lg font-bold ml-4 whitespace-nowrap">View All</div>
                                        </div>
<<<<<<< HEAD
                                        <div className='w-full'>
                                            <h4 className="text-base font-bold text-white mb-0.5">
                                                {userRole === 'Admin' ? "Registration Requests" : userRole === 'Instructor' ? "Curriculum Modules" : `${userDiscipline} Week 1`}
                                            </h4>
                                            <p className="text-sm text-zinc-400">
                                                {userRole === 'Admin' ? "Review and approve new signups" : userRole === 'Instructor' ? "Edit and manage course content" : "Introduction to the Track"}
                                            </p>
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
=======

                                        <div onClick={() => router.push('/role-requests')} className="border border-slate-400/30 rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all hover:bg-white/5">
                                            <div className="flex items-center gap-3.5 w-full">
                                                <div className="min-w-[50px] h-[50px] bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center text-[20px]">🛡️</div>
                                                <div className='w-full'>
                                                    <h4 className="text-[15px] font-bold text-white mb-0.5">Instructor Applications</h4>
                                                    <p className="text-[12px] text-zinc-400">Review pending role requests</p>
                                                </div>
                                            </div>
                                            <div className="px-4 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-600/30 text-[10px] rounded-lg font-bold ml-4 whitespace-nowrap">Manage</div>
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
                                        </div>
                                    </>
                                ) : (
                                    <div className="border border-slate-400/30 rounded-xl p-3.5 flex items-center justify-between bg-white/5">
                                        <div className="flex items-center gap-3.5 w-full">
                                            <div className="min-w-[60px] h-[60px] bg-gray-200/20 rounded-xl flex items-center justify-center text-[22px]">
                                                {userRole === 'Learner' ? "⏰" : "📂"}
                                            </div>
                                            <div className='w-full'>
                                                <h4 className="text-base font-bold text-white mb-0.5">
                                                    {userRole === 'Instructor' ? "Curriculum Modules" : `${userDiscipline} Week 1`}
                                                </h4>
                                                <p className="text-sm text-zinc-400">
                                                    {userRole === 'Instructor' ? "Edit content" : "Introduction to the Track"}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="px-4.5 py-2 bg-stone-600/80 text-white text-[11px] rounded-lg font-semibold ml-4 hover:bg-stone-600">Manage</button>
                                    </div>
                                )}
                            </div>
                        </section>

                        {userRole === 'Learner' && (
                            <section className="border border-slate-400 rounded-xl p-5 bg-gradient-to-r from-blue-600/10 to-transparent">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Become an Instructor</h3>
                                        <p className="text-xs text-zinc-400">Share your expertise and transition your role.</p>
                                    </div>
                                    <button onClick={() => setIsModalOpen(true)} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-all">Apply Now</button>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Recent Activity Sidebar */}
                    <div className="flex flex-col gap-4">
<<<<<<< HEAD
                        <section className="border border-slate-400 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">⏱️</span>
                                <h3 className="text-xl font-bold text-white">Upcoming Deadlines</h3>
                            </div>
                            <div className="space-y-2.5">
                                {!loading && deadlines.length === 0 ? (
                                    <p className="text-sm text-zinc-400">No upcoming deadlines.</p>
                                ) : deadlines.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between border-b border-gray-600 py-3 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-300 rounded-lg p-1.5 text-center min-w-12.5">
                                                <p className="text-sm font-bold text-white leading-none">{d.date.split(' ')[0]}</p>
                                                <p className="text-[10px] text-blue-700 mt-1 uppercase">{d.date.split(' ')[1]}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white mb-1">{d.title}</p>
                                                <p className="text-xs text-zinc-400">{d.course}</p>
                                            </div>
=======
                        {userRole === 'Admin' ? (
                            <section className="border border-slate-400 rounded-xl p-4 bg-white/5">
                                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><span>⚡</span> Recent Activity</h3>
                                <div className="space-y-2.5">
<<<<<<< HEAD
                                    {activities.length > 0 ? activities.slice(0, 5).map((act, i) => (
                                        <div key={i} className="flex flex-col border-b border-gray-600/50 py-3 last:border-0">
                                            <p className="text-xs font-bold text-white mb-1">{act.description}</p>
                                            <p className="text-[10px] text-zinc-500">{formatTime(act.occurredAt)}</p>
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
=======
                                    {activities.length > 0 ? activities.slice(0, 6).map((act, i) => (
                                        <div key={i} className="flex flex-col border-b border-gray-600/50 py-2 last:border-0">
                                            <p className="text-[11px] font-bold text-white">{act.description}</p>
                                            <p className="text-[9px] text-zinc-500">{formatTimeAgo(act.occurredAt)}</p>
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
                                        </div>
                                    )) : <p className="text-xs text-zinc-500 italic">No activity logs.</p>}
                                </div>
                            </section>
                        ) : (
                            <section className="border border-slate-400 rounded-xl p-6 text-center bg-white/5 shadow-inner relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
                                <p className="text-[10px] font-bold text-slate-400 tracking-[2px] mb-2 uppercase tracking-widest">TRUEMINDS {userRole}</p>
                                <p className="text-xl font-black text-blue-500 mb-1.5">{identityCard.publicId}</p>
                                <p className="text-lg font-bold text-white mb-1">{identityCard.fullName}</p>
                                <p className="text-xs text-zinc-500 mb-4">{identityCard.discipline} • {identityCard.cohortLabel}</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {userBadges.map((badge, idx) => (
                                        <span key={idx} className="px-2 py-0.5 rounded bg-blue-600/20 border border-blue-500/30 text-[9px] font-bold text-blue-400 uppercase">{badge.label}</span>
                                    ))}
                                </div>
                            </section>
                        )}
<<<<<<< HEAD

<<<<<<< HEAD
                        <section className=" border border-slate-400 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white">My Team</h3>
                                <button className="text-white text-[11px] font-bold bg-[#30363d] px-3 py-1.25 rounded-lg border border-zinc-700">View</button>
                            </div>
                            <div className="bg-blue-300/20 w-fit rounded-lg px-3 py-1.5 mb-3 border border-blue-300/30">
                                <p className="text-xs font-bold text-blue-300">{teamName || 'No team assigned yet'}</p>
                            </div>
                            <div className="space-y-3 px-1">
                                {!loading && teamMembers.length === 0 ? (
                                    <p className="text-sm text-zinc-400">No team members available.</p>
                                ) : teamMembers.map((member, i) => (
                                    <div key={`${member.fullName}-${i}`} className="flex items-center gap-2 text-[11px] text-zinc-400">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-[10px] ${member.isCurrentUser ? 'bg-blue-600' : i % 2 ? 'bg-green-500' : 'bg-purple-500'}`}>
                                            {member.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <p>{member.isCurrentUser ? `${member.fullName} (You)` : member.fullName}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="border border-slate-400 rounded-xl p-6 text-center bg-white/5">
                            <p className="text-[10px] font-bold text-slate-400 tracking-[2px] mb-2.5 uppercase">TrueMinds Innovation</p>
                            <p className="text-xl font-black text-blue-500 tracking-tight mb-1.5">{identityCard.publicId || '-'}</p>
                            <p className="text-lg font-bold text-white mb-1">{identityCard.fullName || userName || '-'}</p>
                            <p className="text-xs text-zinc-500">{[identityCard.discipline, identityCard.cohortLabel].filter(Boolean).join(' ') || '-'}</p>
=======
                        <section className="border border-slate-400 rounded-xl p-6 text-center bg-white/5 shadow-inner">
                            <p className="text-[10px] font-bold text-slate-400 tracking-[2px] mb-2.5 uppercase">TRUEMINDS {userRole}</p>
                            <p className="text-xl font-black text-blue-500 tracking-tight mb-1.5">{identityCard.publicId}</p>
                            <p className="text-lg font-bold text-white mb-1">{identityCard.fullName}</p>
                            <p className="text-xs text-zinc-500">{identityCard.discipline} • {identityCard.cohortLabel}</p>
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
                        </section>
=======
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
                    </div>
                </div>
            </section>

            <RequestInstructorModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => alert("Application submitted successfully!")}
            />
        </main>
    );
}