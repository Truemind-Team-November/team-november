"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeColors } from '@/components/ThemeColors';
import client from "@/lib/client";

export default function AdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    
    // New state for tab filtering
    const [selectedRole, setSelectedRole] = useState("All");

    const roles = ["All", "Admin", "Instructor", "Learner"];

    useEffect(() => {
        const checkAuthAndFetchUsers = async () => {
            try {
                const profileRes = await client.get('/Profile/me');
                
                if (profileRes.data?.success && profileRes.data.data.role === 'Admin') {
                    setIsAuthorized(true);
                    const usersRes = await client.get('/Users');
                    console.log(usersRes);                    
                    if (usersRes.data?.success) {
                        setUsers(usersRes.data.data);
                    }
                } else {
                    router.push('/dashboard');
                }
            } catch (err) {
                console.error("Authorization or fetch error:", err);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndFetchUsers();
    }, [router]);

    if (loading) {
        return (
            <div style={{ backgroundColor: ThemeColors.bgBlue }} className="min-h-screen flex items-center justify-center text-white">
                <div className="animate-pulse">Verifying credentials...</div>
            </div>
        );
    }

    if (!isAuthorized) return null;

    // Enhanced filtering logic: Filter by Role TAB + Search Input
    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.publicId?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = selectedRole === "All" || user.role === selectedRole;

        return matchesSearch && matchesRole;
    });

    return (
        <section style={{ backgroundColor: ThemeColors.bgBlue }} className="min-h-screen p-4 md:p-8 text-zinc-300 font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white">User Directory</h1>
                    <p className="text-sm text-zinc-400">Manage and oversee all platform participants</p>
                </div>

                {/* Controls: Tabs & Search */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                    
                    {/* Role Tabs */}
                    <div className="flex gap-2 p-1 border border-slate-500/30 rounded-xl w-fit">
                        {roles.map((role) => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                                    selectedRole === role 
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative">
                        <input 
                            type="text"
                            placeholder="Search by name, ID or email..."
                            className="bg-white/5 border border-slate-500 rounded-lg px-4 py-2.5 text-sm w-full md:w-80 focus:outline-none focus:border-blue-500 transition-colors"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="border border-slate-500 rounded-xl overflow-hidden bg-white/5 shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/10 text-white text-[12px] uppercase tracking-wider">
                                    <th className="p-4 font-bold">Public ID</th>
                                    <th className="p-4 font-bold">Name & Email</th>
                                    <th className="p-4 font-bold">Role</th>
                                    <th className="p-4 font-bold">Discipline</th>
                                    <th className="p-4 font-bold">Location</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-700">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/[0.04] transition-colors">
                                        <td className="p-4 font-mono text-blue-400 font-bold">{user.publicId}</td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-white font-semibold">{user.fullName}</span>
                                                <span className="text-xs text-zinc-500">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                                                user.role === 'Admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                                user.role === 'Instructor' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-zinc-400">{user.discipline || "N/A"}</td>
                                        <td className="p-4 text-zinc-400">{user.location || "Remote"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Empty State */}
                    {filteredUsers.length === 0 && (
                        <div className="p-16 text-center">
                            <div className="text-3xl mb-4">🔍</div>
                            <p className="text-zinc-500 italic text-sm">
                                No {selectedRole.toLowerCase()}s found matching your criteria.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}