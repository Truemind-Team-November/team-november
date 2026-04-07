"use client";
import { useState, useEffect } from "react";
import { ThemeColors } from '@/components/ThemeColors';
import client from "@/lib/client";

export default function Dashboard() {
    const [userData, setUserData] = useState({
        fullName: "User",
        publicId: "TMI-2025-047",
        discipline: "UI/UX Design",
        cohort: "Cohort 3",
        stats: {
            courses: 0,
            progress: 0,
            certificates: 0,
            tasks: 0 
        }
    });
    const [loading, setLoading] = useState(true);

    const learningCourses = [
        { emoji: "⏰", title: 'UI/UX Fundamentals', lesson: 'Lesson 6 of 12, Design System', access: 'Last accessed, 12 hours ago', progress: '72%', btn: 'Resume' },
        { emoji: "🖥️", title: 'Product Thinking', lesson: 'Lesson 3 of 8, User Research', access: 'Last accessed, yesterday', progress: '64%', btn: 'Continue' },
        { emoji: "📊", title: 'Product Thinking', lesson: 'Lesson 3 of 8, User Research', access: 'Last accessed, 1 week ago', progress: '30%', btn: 'Continue' },
    ];

    const deadlines = [
        { date: '28 MAR', title: 'Wireframe Challenge #3', course: 'UI/UX Fundamentals', status: '2d left' },
        { date: '01 APR', title: 'User Journey Map', course: 'Product Thinking', status: '4d left' },
        { date: '05 APR', title: 'Print Retrospective', course: 'Agile & Scrum', status: '10d left' },
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await client.get("/Profile/me");
                if (response.data.success) {
                    const d = response.data.data;
                    setUserData({
                        fullName: d.fullName || "User",
                        publicId: d.publicId || "TMI-2025-047",
                        discipline: d.personalInformation?.discipline || "UI/UX Design",
                        cohort: d.personalInformation?.cohortLabel || "Cohort 3",
                        stats: {
                            courses: d.learningSummary?.courses || 0,
                            progress: d.learningSummary?.averageProgress || 0,
                            certificates: d.learningSummary?.certificates || 0,
                            tasks: 3
                        }
                    });
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const statsCards = [
        { icon: "📚", title: 'Courses Enrolled', value: userData.stats.courses, statIcon: "↑", statText: 'Overall', statColor: 'text-blue-500' },
        { icon: "✅", title: 'Avg Completion', value: `${userData.stats.progress}%`, statIcon: "↑", statText: 'Progress', statColor: 'text-blue-500' },
        { icon: "🗒️", title: 'Pending Tasks', value: userData.stats.tasks, statText: 'Due this week', statColor: 'text-red-500' },
        { icon: "🏆", title: 'Certificates', value: userData.stats.certificates, statText: 'Earned', statColor: 'text-blue-500' },
    ];

    return (
        <main>            
            <section style={{ backgroundColor: ThemeColors.bgBlue }} className="flex-1 min-h-screen text-zinc-300 font-sans p-4 md:p-8 overflow-y-auto">

                {/* Header */}
                <div className="flex md:items-center justify-between mb-5 px-2 max-md:flex-col max-md:gap-5">
                    <div>
                        <h1 className="text-[22px] font-bold text-white leading-tight">Good morning,</h1>
                        <h2 className="text-[22px] font-bold text-white leading-tight">
                            {loading ? "..." : userData.fullName}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[18px] font-semibold text-white">{userData.cohort}. Week 6</span>
                        <button className="flex items-center justify-center w-8 h-8 bg-[#161b22] border border-slate-400 rounded-md text-[14px]">🔔</button>
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-[14px]">
                            {getInitials(userData.fullName)}
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid md:grid-cols-4 grid-cols-2 gap-3 mb-5">
                    {statsCards.map((s, i) => (
                        <div key={i} className="border border-slate-400 rounded-xl p-3.5">
                            <div className="text-sm mb-2 p-1 rounded-sm bg-gray-200/30 w-fit">{s.icon}</div>
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
                    {/* LEFT COLUMN */}
                    <div className="flex flex-col gap-4">
                        <section className="border border-slate-400 rounded-xl md:p-4 p-2">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[14px] font-bold text-white">Continue Learning</h3>
                                <button className="px-5 py-2 text-white text-[11px] rounded-lg font-semibold bg-stone-600/80">View all</button>
                            </div>
                            <div className="space-y-2.5">
                                {learningCourses.map((c, i) => (
                                    <div key={i} className="border border-slate-400 rounded-xl p-3.5 flex items-center justify-between max-md:flex-col max-md:gap-3">
                                        <div className="flex items-center gap-3.5 w-full">
                                            <div className="min-w-[60px] h-[60px] bg-gray-200 rounded-xl flex items-center justify-center text-[22px]">{c.emoji}</div>
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
                                        <button className="px-4.5 py-2 bg-stone-600/80 text-white text-[11px] rounded-lg font-semibold max-md:w-full ml-4">{c.btn}</button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col gap-4">
                        <section className="border border-slate-400 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">⏱️</span>
                                <h3 className="text-xl font-bold text-white">Upcoming Deadlines</h3>
                            </div>
                            <div className="space-y-2.5">
                                {deadlines.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between border-b border-gray-600 py-3 last:border-0">
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
                                ))}
                            </div>
                        </section>

                        {/* ID Card Section */}
                        <section className="border border-slate-400 rounded-xl p-6 text-center bg-white/5">
                            <p className="text-[10px] font-bold text-slate-400 tracking-[2px] mb-2.5 uppercase">TrueMinds Innovation</p>
                            <p className="text-xl font-black text-blue-500 tracking-tight mb-1.5">{userData.publicId}</p>
                            <p className="text-lg font-bold text-white mb-1">{userData.fullName}</p>
                            <p className="text-xs text-zinc-500">{userData.discipline} {userData.cohort}</p>
                        </section>
                    </div>
                </div>
            </section>
        </main>
    );
}