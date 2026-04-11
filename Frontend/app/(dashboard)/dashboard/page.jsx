"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeColors } from '@/components/ThemeColors';
import client from "@/lib/client";

export default function Dashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState("User");
    const [userRole, setUserRole] = useState("Learner");
    const [loading, setLoading] = useState(true);
    const [userDiscipline, setUserDiscipline] = useState('General Track');

    const [stats, setStats] = useState([]);
    const [deadlines, setDeadlines] = useState([]);
    const [pendingReviews, setPendingReviews] = useState([]);
    const [identityCard, setIdentityCard] = useState({
        fullName: 'User',
        publicId: 'TF-2026-000',
        discipline: 'Intern',
        cohortLabel: 'Cohort 3',
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch Profile to get the Role
                const profileRes = await client.get('/Profile/me');
                const profile = profileRes.data?.data;

                if (!profile) {
                    router.push("/signup");
                    return;
                }

                const role = profile.role || 'Learner';
                const name = profile.fullName || 'User';
                const discipline = profile.personalInformation?.discipline || 'General Track';

                setUserName(name);
                setUserRole(role);
                setUserDiscipline(discipline);

                // 2. Determine Endpoint
                let endpoint = '/Dashboard/me';
                if (role === 'Instructor') endpoint = '/Dashboard/instructor';
                if (role === 'Admin') endpoint = '/Dashboard/admin';

                // 3. Fetch Dashboard Data with specific 403 / Error Handling
                try {
                    const dashRes = await client.get(endpoint);
                    const payload = dashRes.data?.data;
                    // console.log(payload);
                    

                    if (role === 'Instructor' && payload?.metrics) {
                        const m = payload.metrics;
                        setStats([
                            { icon: "👨‍🏫", title: 'Total Learners', value: String(m.totalLearners ?? 0), statIcon: "↑", statText: 'Active', statColor: 'text-blue-500' },
                            { icon: "📝", title: 'Pending Grading', value: String(m.pendingGrading ?? 0), statIcon: "!", statText: 'Review needed', statColor: 'text-red-500' },
                            { icon: "📚", title: 'Total Courses', value: String(m.totalCourses ?? 0), statText: 'Assigned', statColor: 'text-blue-500' },
                            { icon: "📤", title: 'Total Submissions', value: String(m.totalSubmissions ?? 0), statText: 'Total received', statColor: 'text-blue-500' },
                        ]);
                        setPendingReviews(payload.pendingReviews || []);
                    } else if (role === 'Learner' && payload) {
                        // Learner stats mapping
                        const ls = profile.learningSummary || {};
                        setStats([
                            { icon: '📚', title: 'Courses', value: String(ls.courses ?? 0), statIcon: '↑', statText: 'Enrolled', statColor: 'text-blue-500' },
                            { icon: '✅', title: 'Progress', value: `${Math.round(ls.averageProgress ?? 0)}%`, statIcon: '↑', statText: 'Average', statColor: 'text-blue-500' },
                            { icon: '🗒️', title: 'Tasks', value: '3', statText: 'Pending', statColor: 'text-red-500' },
                            { icon: '🏆', title: 'Certificates', value: String(ls.certificates ?? 0), statText: 'Earned', statColor: 'text-blue-500' },
                        ]);
                        if (payload.upcomingDeadlines) {
                            setDeadlines(payload.upcomingDeadlines.slice(0, 3).map(item => ({
                                date: item.dueDate ? `${new Date(item.dueDate).getDate()} ${new Date(item.dueDate).toLocaleString('en', { month: 'short' }).toUpperCase()}` : 'N/A',
                                title: item.assignmentTitle,
                                course: item.courseTitle,
                                status: `${item.daysRemaining}d left`,
                            })));
                        }
                    }
                } catch (dashErr) {
                    console.error(`Dashboard API Error (${endpoint}):`, dashErr);
                    
                    // FALLBACK: If 403 or server error, still show the boxes with 0 for Instructors
                    if (role === 'Instructor') {
                        setStats([
                            { icon: "👨‍🏫", title: 'Total Learners', value: "0", statIcon: "—", statText: 'No Data', statColor: 'text-zinc-500' },
                            { icon: "📝", title: 'Pending Grading', value: "0", statIcon: "—", statText: 'No Data', statColor: 'text-zinc-500' },
                            { icon: "📚", title: 'Total Courses', value: "0", statText: 'No Data', statColor: 'text-zinc-500' },
                            { icon: "📤", title: 'Total Submissions', value: "0", statText: 'No Data', statColor: 'text-zinc-500' },
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
                console.error("Profile Fetch Error:", err);
                if (err.response?.status === 401) router.push("/signup");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [router]);

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    if (loading) return <div style={{ backgroundColor: ThemeColors.bgBlue }} className="min-h-screen"></div>;

    return (
        <main>
            <section style={{ backgroundColor: ThemeColors.bgBlue }} className="flex-1 min-h-screen text-zinc-300 font-sans p-4 md:p-8 overflow-y-auto">

                {/* Header */}
                <div className="flex md:items-center justify-between mb-5 px-2 max-md:flex-col max-md:gap-5">
                    <div>
                        <h1 className="text-[22px] font-bold text-white leading-tight">Welcome,</h1>
                        <h2 className="text-[22px] font-bold text-white leading-tight">{userName}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[18px] font-semibold text-white">Cohort 3. Week 6</span>
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-[14px]">
                            {getInitials(userName)}
                        </div>
                    </div>
                </div>

                {/* THE 4 BOXES AT THE TOP */}
                <div className="grid md:grid-cols-4 grid-cols-2 gap-3 mb-5">
                    {stats.map((s, i) => (
                        <div key={i} className="border border-slate-400 rounded-xl p-3.5 bg-white/5">
                            <div className="text-sm mb-2 p-1 rounded-sm bg-gray-200/10 w-fit">{s.icon}</div>
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
                        <section className="border border-slate-400 rounded-xl md:p-4 p-2">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[14px] font-bold text-white">
                                    {userRole === 'Instructor' ? "Course Management" : "Continue Learning"}
                                </h3>
                                <button className="px-5 py-2 text-white text-[11px] rounded-lg font-semibold bg-stone-600/80">View all</button>
                            </div>
                            
                            <div className="space-y-2.5">
                                <div className="border border-slate-400 rounded-xl p-3.5 flex items-center justify-between bg-white/5">
                                    <div className="flex items-center gap-3.5 w-full">
                                        <div className="min-w-[60px] h-[60px] bg-gray-200/20 rounded-xl flex items-center justify-center text-[22px]">
                                            {userRole === 'Instructor' ? "📂" : "⏰"}
                                        </div>
                                        <div className='w-full'>
                                            <h4 className="text-base font-bold text-white mb-0.5">
                                                {userRole === 'Instructor' ? "Curriculum Modules" : `${userDiscipline} Week 1`}
                                            </h4>
                                            <p className="text-sm text-zinc-400">
                                                {userRole === 'Instructor' ? "Edit and manage course content" : "Introduction to the Track"}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="px-4.5 py-2 bg-stone-600/80 text-white text-[11px] rounded-lg font-semibold ml-4">
                                        {userRole === 'Instructor' ? "Manage" : "Start"}
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="flex flex-col gap-4">
                        {userRole === 'Instructor' ? (
                            <section className="border border-slate-400 rounded-xl p-4 bg-white/5">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-2xl">✍️</span>
                                    <h3 className="text-xl font-bold text-white">Pending Reviews</h3>
                                </div>
                                <div className="space-y-2.5">
                                    {pendingReviews.length > 0 ? pendingReviews.map((r, i) => (
                                        <div key={i} className="flex items-center justify-between border-b border-gray-600/50 py-3 last:border-0">
                                            <div>
                                                <p className="text-sm font-bold text-white mb-1">{r.studentName || "Student Submission"}</p>
                                                <p className="text-xs text-zinc-400">{r.assignmentTitle || "Project"}</p>
                                            </div>
                                            <button className="text-[9px] text-white font-bold bg-blue-600 px-3 py-1 rounded-md uppercase">Grade</button>
                                        </div>
                                    )) : <p className="text-xs text-zinc-500 italic px-1">All submissions graded! 🎉</p>}
                                </div>
                            </section>
                        ) : (
                            <section className="border border-slate-400 rounded-xl p-4 bg-white/5">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-2xl">⏱️</span>
                                    <h3 className="text-xl font-bold text-white">Upcoming Deadlines</h3>
                                </div>
                                <div className="space-y-2.5">
                                    {deadlines.length > 0 ? deadlines.map((d, i) => (
                                        <div key={i} className="flex items-center justify-between border-b border-gray-600/50 py-3 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-300 rounded-lg p-1.5 text-center min-w-[50px]">
                                                    <p className="text-sm font-bold text-white leading-none">{d.date.split(' ')[0]}</p>
                                                    <p className="text-[10px] text-blue-700 mt-1 uppercase">{d.date.split(' ')[1]}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white mb-1">{d.title}</p>
                                                    <p className="text-xs text-zinc-400">{d.course}</p>
                                                </div>
                                            </div>
                                            <span className="text-[9px] text-white font-bold bg-red-500 px-2 py-0.75 rounded-md">{d.status}</span>
                                        </div>
                                    )) : <p className="text-xs text-zinc-500 italic px-1">No deadlines found.</p>}
                                </div>
                            </section>
                        )}

                        <section className="border border-slate-400 rounded-xl p-6 text-center bg-white/5">
                            <p className="text-[10px] font-bold text-slate-400 tracking-[2px] mb-2.5 uppercase">TRUEMINDS {userRole}</p>
                            <p className="text-xl font-black text-blue-500 tracking-tight mb-1.5">{identityCard.publicId}</p>
                            <p className="text-lg font-bold text-white mb-1">{identityCard.fullName}</p>
                            <p className="text-xs text-zinc-500">{identityCard.discipline} • {identityCard.cohortLabel}</p>
                        </section>
                    </div>
                </div>
            </section>
        </main>
    );
}