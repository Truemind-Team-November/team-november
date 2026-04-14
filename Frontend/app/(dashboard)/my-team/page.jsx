"use client";

<<<<<<< HEAD
import { useEffect, useState } from "react";
import { ThemeColors } from "@/components/ThemeColors";
import client from "@/lib/client";
=======
import { ThemeColors } from "@/components/ThemeColors";
import client from "@/lib/client";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

const AVATAR_COLORS = ["bg-blue-600", "bg-blue-700", "bg-blue-800", "bg-red-700", "bg-slate-600", "bg-indigo-600", "bg-violet-600"];

function getInitials(name) {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
}

function getColor(id) {
  if (!id) return AVATAR_COLORS[0];
  const charSum = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_COLORS[charSum % AVATAR_COLORS.length];
}
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d

export default function TeamAllocation() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTeam = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await client.get("/Dashboard/me");
        setTeam(response.data?.data?.myTeam || null);
      } catch (err) {
        console.error("Team fetch error:", err);
        setError("Unable to load team allocation right now.");
        setTeam(null);
=======
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Check user role first to avoid unnecessary 400 errors for Instructors
        const userRes = await client.get("/Profile/me");
        const userData = userRes.data?.data;

        if (userData?.role === "Instructor") {
          // Instructors don't have a "my-team", so we skip the call
          setTeam(null);
          setLoading(false);
          return;
        }

        // 2. Only if they are a student, try to fetch the team
        const response = await client.get("/Team/my-team");
        
        if (response.data.success) {
          setTeam(response.data.data);
        }
      } catch (error) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        // Silently handle the "No Team" state
        if (status === 400 || message === "User is not assigned to a team") {
          setTeam(null);
        } else {
          console.error("Team Fetch Error:", error);
          setError("Failed to load team data.");
        }
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
      } finally {
        setLoading(false);
      }
    };

<<<<<<< HEAD
    loadTeam();
  }, []);

  return (
    <main style={{ backgroundColor: ThemeColors.bgBlue }} className="min-h-screen text-zinc-300 font-sans p-4 md:p-8">
      <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-6">
        <h1 className="text-2xl font-bold text-white">Team Allocation</h1>
      </div>

      {loading && <div className="rounded-2xl border border-slate-400 p-6 text-sm text-zinc-300">Loading team allocation...</div>}
      {error && <div className="rounded-2xl border border-red-500/40 p-6 text-sm text-red-300">{error}</div>}

      {!loading && !error && !team && (
        <div className="rounded-2xl border border-slate-400 p-10 text-center">
          <p className="text-xl font-bold text-white mb-2">No team assigned yet</p>
          <p className="text-sm text-zinc-400">Your team information will appear here when available.</p>
        </div>
      )}

      {!loading && !error && team && (
        <div className="grid grid-cols-1 gap-4">
          <div className="border border-slate-400 rounded-2xl p-5 bg-transparent min-h-40">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-xl">
               TEAM
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight">{team.teamName}</h2>
                <p className="text-xs text-blue-500 font-medium">{team.memberCount} Members</p>
              </div>
            </div>

            <div className="space-y-5">
              {(team.members || []).map((member, index) => (
                <div key={`${member.userId}-${index}`} className="flex items-center gap-3">
                  <div className={`${member.isCurrentUser ? "bg-blue-600" : "bg-blue-800"} w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                    {member.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">
                      {member.fullName} {member.isCurrentUser && <span className="text-blue-500 font-medium ml-1">(You)</span>}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate">{member.discipline}</p>
=======
    fetchTeamData();
  }, []);

  return (
    <main
      style={{ backgroundColor: ThemeColors.bgBlue }}
      className="min-h-screen text-zinc-300 font-sans p-4 md:p-8"
    >
      <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-6">
        <h1 className="text-2xl font-bold text-white">Team Allocation</h1>
        <div className="bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded-full">
          <p className="text-[10px] font-bold text-blue-400">Cohort 3 • Training</p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <Spinner message="Checking team status..." />
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center">
          <h2 className="text-xl font-bold text-white mb-2">Notice</h2>
          <p className="text-zinc-500">{error}</p>
        </div>
      ) : !team ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center border border-dashed border-zinc-800 rounded-2xl">
          <div className="text-4xl mb-4 opacity-10">👥</div>
          <p className="text-zinc-500 italic max-w-sm">
            You are currently not assigned to a team. 
            {/* Context-aware message */}
            <br /> <span className="text-xs mt-2 block">If you are an Instructor, please use the Admin Dashboard to manage teams.</span>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-slate-700 rounded-2xl p-6 bg-[#161f2c]/50 backdrop-blur-sm shadow-xl">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-2xl">🛡️</div>
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">{team.name}</h2>
                <p className="text-sm text-blue-400 font-semibold mt-1">{team.members?.length || 0} Members</p>
              </div>
            </div>

            <div className="space-y-6">
              {team.members?.map((member) => (
                <div key={member.id} className="flex items-center gap-4">
                  <div className={`${getColor(member.id)} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {getInitials(member.fullName)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">
                      {member.fullName}
                      {member.isCurrentUser && <span className="text-[10px] text-blue-400 ml-2">(You)</span>}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate uppercase tracking-wide">{member.discipline || "Learner"}</p>
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
