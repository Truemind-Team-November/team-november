"use client";

import { ThemeColors } from "@/components/ThemeColors";
import client from "@/lib/client";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-blue-700",
  "bg-blue-800",
  "bg-red-700",
  "bg-slate-600",
  "bg-indigo-600",
  "bg-violet-600",
];

function getInitials(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

function getColor(id) {
  if (!id) return AVATAR_COLORS[0];
  const charSum = id
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_COLORS[charSum % AVATAR_COLORS.length];
}

export default function TeamAllocation() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await client.get("/Team/my-team");
        if (response.data.success) {
          setTeam(response.data.data);
        } else {
          setError(response.data.message || "Failed to load team data.");
        }
      } catch (error) {
        const data = error.response?.data;

        // Backend bug: returns 400 for a valid "no team" state
        if (data?.message === "User is not assigned to a team") {
          setTeam(null); // triggers your "not assigned yet" UI
        } else {
          console.error("Error fetching team:", error);
          setError(
            "Unable to connect to the server. Please check your connection.",
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTeamData();
  }, []);

  return (
    <main
      style={{ backgroundColor: ThemeColors.bgBlue }}
      className="min-h-screen text-zinc-300 font-sans p-4 md:p-8"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-6">
        <h1 className="text-2xl font-bold text-white">Team Allocation</h1>
        <div className="bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded-full">
          <p className="text-[10px] font-bold text-blue-400">
            Cohort 3. 52 Interns
          </p>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <Spinner message="Loading your team information..." />
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-zinc-500 max-w-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
          >
            Try Again
          </button>
        </div>
      ) : !team ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center border border-dashed border-zinc-800 rounded-2xl">
          <p className="text-zinc-500 italic">
            You haven't been assigned to a team yet. Spark a conversation in the
            forums while you wait!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-slate-400 rounded-2xl p-5 bg-transparent min-h-100">
            {/* Team Header */}
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-xl">
                🎨
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight">
                  {team.name}
                </h2>
                <p className="text-xs text-blue-500 font-medium">
                  {team.memberCount} Members
                </p>
              </div>
            </div>

            {/* Member List */}
            <div className="space-y-5">
              {team.members?.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div
                    className={`${getColor(member.id)} w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0`}
                  >
                    {getInitials(member.fullName)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">
                      {member.fullName}{" "}
                      {member.isCurrentUser && (
                        <span className="text-blue-500 font-medium ml-1">
                          (You)
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate">
                      {member.discipline}
                    </p>
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
