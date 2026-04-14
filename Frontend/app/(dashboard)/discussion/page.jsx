"use client";

<<<<<<< HEAD
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
=======
import { ThemeColors } from "@/components/ThemeColors";
import { useEffect, useState } from "react";
import CreatePostForm from "@/components/CreatePost";
import client from "@/lib/client";
import Link from "next/link";
import Spinner from "@/components/Spinner";

const TAG_COLORS = [
  { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/20",
  },
  {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
];

const AVATAR_COLORS = [
  "bg-red-500/80",
  "bg-blue-500/80",
  "bg-slate-500/80",
  "bg-emerald-500/80",
  "bg-orange-500/80",
];

function formatTime(dateString) {
  if (!dateString) return "Just now";
  const date = new Date(dateString).getTime();
  const now = new Date().getTime();
  if (isNaN(date)) return "Just now";
  const diffInMs = now - date;
  if (diffInMs < 0) return "Just now";
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes === 1) return "1 min ago";
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours === 1) return "1 hour ago";
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "1 day ago";
  return `${diffInDays} days ago`;
}

function getInitials(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export default function DiscussionForum() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = isCreateOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCreateOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [postsRes, topRes] = await Promise.all([
        client.get("/Discussion"),
        client.get("/Discussion/top-contributors?count=5"),
      ]);
      if (postsRes?.data?.success) setPosts(postsRes.data.data || []);
      if (topRes?.data?.success) setContributors(topRes.data.data || []);
    } catch (err) {
      console.error("Failed to load discussions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main
      style={{
        backgroundColor: ThemeColors.bgBlue,
        fontFamily: "'DM Sans', sans-serif",
      }}
      className="min-h-screen text-zinc-300 p-4 md:p-8"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');`}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-1">
            Community
          </p>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Discussion Forum
          </h1>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="group relative flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-900/30"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="transition-transform duration-200 group-hover:rotate-90"
          >
            <path
              d="M7 1v12M1 7h12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          New Discussion
        </button>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-8">
        {/* Main Feed */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">
              General Q&A Forum
            </h2>
            {!loading && (
              <span className="text-xs text-zinc-500 bg-white/5 px-3 py-1 rounded-full border border-white/8">
                {posts.length} {posts.length <= 1 ? "thread" : "threads"}
              </span>
            )}
          </div>

          {loading && (
            <div className="py-16 flex justify-center">
              <Spinner message="Loading discussions..." />
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="py-20 text-center rounded-2xl border border-dashed border-white/10">
              <p className="text-zinc-500 text-sm">
                No discussions yet. Be the first to start one!
              </p>
            </div>
          )}

          <div className="space-y-3">
            {!loading &&
              posts.map((post) => (
                <Link
                  href={`/discussion/${post.id}`}
                  key={post.id}
                  className="group flex gap-4 p-5 rounded-2xl border border-white/8 bg-white/2 hover:bg-white/5 hover:border-white/15 transition-all duration-200 no-underline"
                >
                  {/* Vote Column */}
                  <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-blue-500/20 hover:border-blue-500/30 text-zinc-400 hover:text-blue-400 transition-all text-[11px]"
                    >
                      ▲
                    </button>
                    <span className="text-sm font-bold text-white tabular-nums">
                      0
                    </span>
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-rose-500/20 hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 transition-all text-[11px]"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Post Body */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-white mb-1.5 leading-snug group-hover:text-blue-300 transition-colors duration-150 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-zinc-500 leading-relaxed mb-4 line-clamp-2">
                      {post.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      {post.tags?.map((tag, j) => {
                        const color = TAG_COLORS[j % TAG_COLORS.length];
                        return (
                          <span
                            key={tag.id || j}
                            className={`${color.bg} ${color.text} border ${color.border} text-[11px] font-semibold px-2.5 py-0.5 rounded-md tracking-wide`}
                          >
                            {tag.name}
                          </span>
                        );
                      })}

                      <div className="flex items-center gap-1.5 ml-auto text-[11px] text-zinc-600">
                        <span className="text-zinc-400 font-medium">
                          {post.authorName}
                        </span>
                        <span>·</span>
                        <span>{formatTime(post.createdAt)}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M6 1C3.24 1 1 3.02 1 5.5c0 .94.3 1.82.81 2.55L1 11l3.27-.77A5.22 5.22 0 0 0 6 10.5C8.76 10.5 11 8.48 11 6S8.76 1 6 1Z"
                              stroke="currentColor"
                              strokeWidth="1.2"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {post.replyCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside>
          <div className="rounded-2xl border border-white/8 bg-white/2 p-5 sticky top-8">
            <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"></span>
              Top Contributors
            </h3>

            {loading && (
              <div className="py-6 flex justify-center">
                <Spinner message="" />
              </div>
            )}

            {!loading && contributors.length === 0 && (
              <p className="text-zinc-600 text-sm">No contributors yet.</p>
            )}

            <div className="space-y-4">
              {!loading &&
                contributors.map((user, i) => {
                  const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
                  const isTop = i === 0;
                  return (
                    <div
                      key={user.userId || i}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`${color} w-9 h-9 rounded-xl flex items-center justify-center text-white font-semibold text-xs shrink-0`}
                        >
                          {getInitials(user.fullName)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white leading-tight">
                            {user.fullName}
                          </p>
                          <p className="text-[11px] text-zinc-600 mt-0.5">
                            {user.contributionCount || 0} posts
                          </p>
                        </div>
                      </div>
                      {isTop ? (
                        <span className="text-base">🔥</span>
                      ) : (
                        <span className="text-[11px] font-semibold text-zinc-700 tabular-nums">
                          #{i + 1}
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </aside>
      </div>

      {/* Create Post Modal */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 md:left-[250px] z-50 overflow-y-auto bg-[#0a0f1a]/70 backdrop-blur-sm"
          onClick={() => setIsCreateOpen(false)}
        >
          <div className="flex min-h-full items-center justify-center p-4 md:p-8">
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <CreatePostForm
                onClose={() => setIsCreateOpen(false)}
                onSuccess={loadData}
              />
            </div>
          </div>
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
        </div>
      )}
    </main>
  );
}
