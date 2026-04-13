"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeColors } from '@/components/ThemeColors';
import client from "@/lib/client";

export default function RoleRequestManager() {
    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const verifyAndFetch = async () => {
            try {
                // 1. Verify Admin Status
                const profileRes = await client.get('/Profile/me');
                if (profileRes.data?.data?.role !== 'Admin') {
                    router.push('/dashboard');
                    return;
                }
                setIsAdmin(true);
                
                // 2. Fetch Requests
                await fetchRequests();
            } catch (err) {
                console.error("Auth/Fetch Error:", err);
                router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        verifyAndFetch();
    }, [router]);

    const fetchRequests = async () => {
        try {
            const res = await client.get('/admin/role-requests?status=pending');
            setRequests(res.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        }
    };

    const handleAction = async (requestId, action) => {
        try {
            if (action === 'approve') {
                await client.patch(`/admin/approve-role/${requestId}`);
            } else {
                await client.patch(`/admin/reject-role`, {
                    roleRequestId: requestId,
                    rejectionReason: "Criteria not met"
                });
            }
            alert(`Application ${action === 'approve' ? 'approved' : 'rejected'}`);
            fetchRequests();
        } catch (err) {
            alert(err.response?.data?.message || "Action failed");
        }
    };

    if (loading) return (
        <div style={{ backgroundColor: ThemeColors.bgBlue }} className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!isAdmin) return null;

    return (
        <main style={{ backgroundColor: ThemeColors.bgBlue }} className="min-h-screen p-4 md:p-8 font-sans text-zinc-300">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb/Back */}
                <button 
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 text-xs font-bold text-blue-500 mb-6 hover:text-blue-400 transition-colors uppercase tracking-widest"
                >
                    ← Back to Dashboard
                </button>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-white">Instructor Applications</h1>
                        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-bold">Role Transition Requests • {requests.length} Pending</p>
                    </div>
                </div>

                <div className="grid gap-4">
                    {requests.length > 0 ? requests.map((req) => (
                        <div key={req.id} className="border border-slate-400/20 rounded-2xl bg-white/5 p-5 backdrop-blur-sm shadow-xl">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                {/* Profile Info */}
                                <div className="flex gap-4 flex-1">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-lg font-black text-blue-400 shadow-inner">
                                        {req.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{req.fullName}</h3>
                                        <p className="text-xs text-blue-500/80 font-mono font-bold">{req.publicId}</p>
                                        <p className="text-[11px] text-zinc-500 mt-1">{req.email}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleAction(req.id, 'reject')}
                                        className="flex-1 md:flex-none px-6 py-2.5 bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-black rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300"
                                    >
                                        REJECT
                                    </button>
                                    <button
                                        onClick={() => handleAction(req.id, 'approve')}
                                        className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all duration-300"
                                    >
                                        APPROVE
                                    </button>
                                </div>
                            </div>

                            {/* Bio Box */}
                            <div className="mt-6 bg-black/30 rounded-xl p-4 border border-white/5 relative">
                                <span className="absolute -top-2 left-4 px-2 bg-zinc-900 text-[9px] font-black text-zinc-500 uppercase tracking-tighter">Statement of Purpose</span>
                                <p className="text-[13px] text-zinc-300 leading-relaxed italic">
                                    "{req.bio}"
                                </p>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Expertise:</span>
                                    <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                                        {req.expertise}
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-zinc-600">{new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 border border-dashed border-slate-400/20 rounded-3xl">
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">All clear! No pending requests.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}