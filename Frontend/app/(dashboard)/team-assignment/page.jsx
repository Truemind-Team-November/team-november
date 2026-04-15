'use client';

import React, { useEffect, useState } from 'react';
import client from '@/lib/client';
import { useRouter } from 'next/navigation';

export default function AdminTeamPage() {
  const router = useRouter();
  
  // Data States
  const [teams, setTeams] = useState([]);
  const [unassignedUsers, setUnassignedUsers] = useState([]);
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Form States
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [assignment, setAssignment] = useState({ teamId: '', userId: '' });

  // 1. Initial Data Fetch & Security Check
  const fetchData = async () => {
    try {
      const me = await client.get('/Profile/me');
      // Ensure only Admins can access this route
      if (me.data?.data?.role !== 'Admin') {
        router.push('/dashboard');
        return;
      }

      // FIXED: Removed extra '/api' from path strings to prevent 404s
      const [teamsRes, usersRes] = await Promise.all([
        client.get('/Team'), 
        client.get('/Team/unassigned-learners')
      ]);

      setTeams(teamsRes.data?.data || []);
      setUnassignedUsers(usersRes.data?.data || []);
    } catch (error) {
      console.error("Admin Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  // 2. Create Team Logic
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeam.name) return;

    setActionLoading(true);
    try {
      // FIXED: Path changed from '/api/Team' to '/Team'
      const res = await client.post('/Team', newTeam);
      if (res.data?.success) {
        setNewTeam({ name: '', description: '' });
        await fetchData(); 
      }
    } catch (err) {
      alert("Error creating team. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Assign User Logic
  const handleAssignUser = async () => {
    if (!assignment.teamId || !assignment.userId) return;

    setActionLoading(true);
    try {
      // FIXED: Path changed from '/api/Team/...' to '/Team/...'
      const res = await client.put(`/Team/${assignment.teamId}/members/${assignment.userId}`);
      if (res.data?.success) {
        setAssignment({ ...assignment, userId: '' });
        await fetchData(); 
        alert("User assigned successfully!");
      }
    } catch (err) {
      alert("Failed to assign user.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#101723]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0950C3] border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#101723] text-[#FAFCFF] p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 border-b border-[#4B4C4E] pb-6">
          <h1 className="text-3xl font-bold">Admin Team Management</h1>
          <p className="text-[#ADC7EB] mt-1">Populate teams and manage learner allocations.</p>
        </header>

        <div className="grid gap-10 lg:grid-cols-2">
          
          {/* TEAM CREATION */}
          <section className="space-y-8">
            <div className="rounded-2xl border border-[#D6E3F5]/20 bg-[#161f2c] p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-6 text-[#0950C3]">1. Create New Team</h2>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 tracking-wider text-[#D6E3F5]">Team Name</label>
                  <input 
                    type="text"
                    required
                    className="w-full rounded-lg border border-[#D6E3F5]/20 bg-[#101723] p-3 text-sm outline-none focus:border-[#0950C3] transition-all"
                    placeholder="e.g., Backend Engineering"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 tracking-wider text-[#D6E3F5]">Description</label>
                  <textarea 
                    rows="3"
                    className="w-full rounded-lg border border-[#D6E3F5]/20 bg-[#101723] p-3 text-sm outline-none focus:border-[#0950C3] transition-all"
                    placeholder="Team goals or focus area..."
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="w-full rounded-xl bg-[#0950C3] py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg"
                >
                  {actionLoading ? 'Creating...' : 'Create Team'}
                </button>
              </form>
            </div>

            {/* ASSIGNMENT FORM */}
            <div className="rounded-2xl border border-[#D6E3F5]/20 bg-[#161f2c] p-6 shadow-xl">
              <h2 className="text-xl font-bold mb-6 text-[#09C398]">2. Assign Learner to Team</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 tracking-wider text-[#D6E3F5]">Unassigned Learner</label>
                  <select 
                    className="w-full rounded-lg border border-[#D6E3F5]/20 bg-[#101723] p-3 text-sm outline-none focus:border-[#09C398]"
                    value={assignment.userId}
                    onChange={(e) => setAssignment({...assignment, userId: e.target.value})}
                  >
                    <option value="">-- Choose a learner ({unassignedUsers.length}) --</option>
                    {unassignedUsers.map(u => (
                      <option key={u.id} value={u.id}>{u.fullName} ({u.discipline})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 tracking-wider text-[#D6E3F5]">Target Team</label>
                  <select 
                    className="w-full rounded-lg border border-[#D6E3F5]/20 bg-[#101723] p-3 text-sm outline-none focus:border-[#09C398]"
                    value={assignment.teamId}
                    onChange={(e) => setAssignment({...assignment, teamId: e.target.value})}
                  >
                    <option value="">-- Choose a team ({teams.length}) --</option>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.memberCount} members)</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={handleAssignUser}
                  disabled={actionLoading || !assignment.teamId || !assignment.userId}
                  className="w-full rounded-xl bg-[#09C398] py-3 font-bold text-[#101723] hover:bg-emerald-500 disabled:opacity-50 transition-all shadow-lg"
                >
                  {actionLoading ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </div>
          </section>

          {/* TEAM LIST DISPLAY */}
          <section>
            <h2 className="text-xl font-bold mb-6">Existing Teams ({teams.length})</h2>
            <div className="grid gap-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {teams.length === 0 ? (
                <div className="text-center p-12 border-2 border-dashed border-[#D6E3F5]/10 rounded-2xl text-[#ADC7EB]">
                  No teams found.
                </div>
              ) : (
                teams.map(team => (
                  <div key={team.id} className="rounded-2xl border border-[#D6E3F5]/10 bg-[#101723] p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{team.name}</h3>
                      <span className="text-xs font-black text-[#09C398] bg-[#09C398]/10 px-2 py-1 rounded">
                        {team.memberCount} MEMBERS
                      </span>
                    </div>
                    <p className="text-sm text-[#ADC7EB] mt-2 line-clamp-2">{team.description}</p>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}