"use client";

import { useEffect, useState } from "react";
import { ThemeColors } from "@/components/ThemeColors";
import client from "@/lib/client";

function formatTime(dateString) {
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function DiscussionForum() {
  const [posts, setPosts] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDiscussion = async () => {
      try {
        setLoading(true);
        setError("");
        const [postsRes, contributorsRes] = await Promise.all([
          client.get("/Discussion"),
          client.get("/Discussion/top-contributors?count=5"),
        ]);

        setPosts(Array.isArray(postsRes.data?.data) ? postsRes.data.data : []);
        setContributors(Array.isArray(contributorsRes.data?.data) ? contributorsRes.data.data : []);
      } catch (err) {
        console.error("Discussion fetch error:", err);
        setError("Unable to load discussion right now.");
        setPosts([]);
        setContributors([]);
      } finally {
        setLoading(false);
      }
    };

    loadDiscussion();
  }, []);

  return (
    <main style={{ backgroundColor: ThemeColors.bgBlue }} className="min-h-screen text-zinc-300 font-sans p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Discussion Forum</h1>
      </div>

      {loading && <div className="rounded-2xl border border-slate-400 p-6 text-sm text-zinc-300">Loading discussion...</div>}
      {error && <div className="rounded-2xl border border-red-500/40 p-6 text-sm text-red-300">{error}</div>}

      {!loading && !error && (
        <div className="grid md:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Latest Discussions</h2>

            {posts.length === 0 ? (
              <div className="border border-slate-400 rounded-2xl p-8 text-center">
                <p className="text-lg font-bold text-white mb-2">No posts yet</p>
                <p className="text-sm text-zinc-400">Discussion posts will appear here once users start conversations.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="border border-slate-400 rounded-2xl p-5 flex gap-5 bg-transparent">
                  <div className="flex flex-col items-center gap-1 min-w-16">
                    <span className="text-lg font-bold text-white">{post.replyCount}</span>
                    <span className="text-xs text-zinc-500">replies</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-4">{post.content}</p>

                    <div className="flex flex-wrap items-center gap-3">
                      {(post.tags || []).map((tag) => (
                        <span key={tag.id} className="bg-blue-600/20 text-blue-300 text-[11px] font-bold px-3 py-1 rounded-full border border-blue-500/30">
                          {tag.name}
                        </span>
                      ))}
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 ml-2">
                        <span>{post.authorName}</span>
                        <span>•</span>
                        <span>{formatTime(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <aside className="space-y-4">
            <div className="border border-slate-400 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6">Top Contributors</h3>
              <div className="space-y-5">
                {contributors.length === 0 ? (
                  <p className="text-sm text-zinc-400">No contributor data yet.</p>
                ) : (
                  contributors.map((user) => (
                    <div key={user.userId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-700 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white leading-tight">{user.fullName}</p>
                          <p className="text-[11px] text-zinc-500">{user.contributionCount} contributions</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
