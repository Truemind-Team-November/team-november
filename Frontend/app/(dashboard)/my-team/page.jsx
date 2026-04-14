"use client";

import { useEffect, useState } from "react";
import { ThemeColors } from "@/components/ThemeColors";
import client from "@/lib/client";

export default function TeamAllocation() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };

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
