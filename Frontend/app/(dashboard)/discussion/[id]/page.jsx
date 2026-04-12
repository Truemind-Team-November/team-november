"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import client from "@/lib/client";
import { ThemeColors } from "@/components/ThemeColors";
import Spinner from "@/components/Spinner";

const TAG_COLORS = [
  { bg: "bg-blue-600/20", text: "text-blue-400" },
  { bg: "bg-purple-600/20", text: "text-purple-400" },
  { bg: "bg-emerald-600/20", text: "text-emerald-400" },
  { bg: "bg-orange-600/20", text: "text-orange-400" },
  { bg: "bg-rose-600/20", text: "text-rose-400" },
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
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function getUserName() {
  if (typeof window === "undefined") return "User";
  try {
    const rawName = localStorage.getItem("userName");
    if (rawName && rawName.trim() !== "") {
      return rawName;
    }
    
    const token = localStorage.getItem("token");
    if (!token) return "User";
    // Parse JWT robustly safely decoding unicode arrays
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    
    if (payload.name) return payload.name;
    if (payload.unique_name) return payload.unique_name;
    if (payload.given_name) return payload.given_name;
    
    const nameKey = Object.keys(payload).find(k => k.endsWith('/name'));
    if (nameKey && payload[nameKey]) return payload[nameKey];
    
    const emailKey = Object.keys(payload).find(k => k.endsWith('/emailaddress'));
    if (emailKey && payload[emailKey]) return payload[emailKey].split('@')[0];
    
    return "User";
  } catch (err) {
    return "User";
  }
}

export default function DiscussionThread() {
  const { id } = useParams();
  const router = useRouter();

  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [error, setError] = useState(null);

  const fetchThread = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      setError(null);
      const res = await client.get(`/Discussion/${id}`);
      if (res.data?.success) {
        setThread(res.data.data);
      } else {
        setError(res.data?.message || "Failed to load thread");
      }
    } catch (err) {
      console.error("Failed to fetch thread:", err);
      setError("Failed to fetch thread details.");
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchThread();
  }, [id]);

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    
    const contentToPost = replyContent;
    const previousThread = { ...thread };
    
    // Optimistic Update
    const optimisticReply = {
      id: `temp-${Date.now()}`,
      authorName: getUserName(),
      createdAt: new Date().toISOString(),
      content: contentToPost,
    };
    
    setThread((prev) => ({
      ...prev,
      replies: [...(prev?.replies || []), optimisticReply],
    }));
    
    setReplyContent("");
    setIsReplying(true);
    
    try {
      const res = await client.post(`/Discussion/${id}/reply`, { content: contentToPost });
      if (res.data?.success) {
        // Silently refresh to get exact server data exact GUIDs and attributes mapping
        await fetchThread(true); 
      } else {
        // Rollback on soft failure
        setThread(previousThread);
        setReplyContent(contentToPost);
        alert(res.data?.message || "Failed to post reply.");
      }
    } catch (err) {
      console.error(err);
      // Rollback on hard error
      setThread(previousThread);
      setReplyContent(contentToPost);
      alert("Failed to post reply. Please try again.");
    } finally {
      setIsReplying(false);
    }
  };

  if (loading) {
    return (
      <main style={{ backgroundColor: ThemeColors.bgBlue }} className="min-h-screen text-zinc-300 font-sans p-4 md:p-8 flex items-center justify-center">
        <Spinner message="Loading thread..." />
      </main>
    );
  }

  if (error || !thread) {
    return (
      <main style={{ backgroundColor: ThemeColors.bgBlue }} className="min-h-screen text-zinc-300 font-sans p-4 md:p-8 flex flex-col items-center justify-center">
        <span className="text-red-400 font-medium mb-4">{error || "Thread not found"}</span>
        <button onClick={() => router.back()} className="text-blue-400 hover:text-blue-300 underline font-medium">
          Go Back
        </button>
      </main>
    );
  }

  const { post, replies } = thread;

  return (
    <main style={{ backgroundColor: ThemeColors.bgBlue }} className="min-h-screen text-zinc-300 font-sans p-4 md:p-8">
      {/* Top Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 font-medium bg-transparent border-none cursor-pointer">
          <span className="text-xl">←</span> Back to Discussions
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Original Post */}
        <div className="border border-[#7D7F82]/30 rounded-2xl p-6 md:p-8 bg-transparent">
          <div className="flex gap-4 md:gap-5">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0950C3] flex items-center justify-center text-white font-bold shrink-0 shadow-sm text-sm md:text-base">
               {getInitials(post.authorName)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-white text-[15px]">{post.authorName}</span>
                <span className="text-xs text-[#7D7F82] font-medium">• {formatTime(post.createdAt)}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-white mb-4 mt-1 leading-snug">
                {post.title}
              </h1>
              <p className="text-sm md:text-[15px] text-[#D6E3F5] leading-relaxed mb-6 whitespace-pre-wrap">
                {post.content}
              </p>
              
              <div className="flex flex-wrap items-center gap-3">
                {post.tags?.map((tag, j) => {
                  const color = TAG_COLORS[j % TAG_COLORS.length];
                  return (
                    <span key={tag.id || j} className={`${color.bg} ${color.text} text-[11px] font-bold px-3 py-1 rounded-full`}>
                      {tag.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Replies Section */}
        <div className="space-y-6 pt-4">
          <h3 className="text-lg font-bold text-white border-b border-[#7D7F82]/30 pb-3 pl-2">
            Responses ({replies?.length || 0})
          </h3>

          <div className="space-y-4">
            {replies?.map((reply) => (
              <div key={reply.id} className="border border-[#7D7F82]/20 rounded-2xl p-5 md:p-6 bg-transparent ml-4 md:ml-12 flex gap-4 transition-colors hover:border-[#7D7F82]/40">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold shrink-0 text-xs md:text-sm">
                  {getInitials(reply.authorName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-[14px] text-zinc-100">{reply.authorName}</span>
                    <span className="text-xs text-[#7D7F82] font-medium">• {formatTime(reply.createdAt)}</span>
                  </div>
                  <p className="text-sm md:text-[15px] text-[#D6E3F5] leading-relaxed whitespace-pre-wrap">
                    {reply.content}
                  </p>
                </div>
              </div>
            ))}
            
            {(!replies || replies.length === 0) && (
              <div className="ml-4 md:ml-12 py-8 text-center border border-dashed border-[#7D7F82]/30 rounded-2xl">
                <p className="text-zinc-500 text-sm italic">No responses yet. Be the first to spark the conversation!</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Reply Sticky Box */}
      <div 
        className="sticky bottom-0 -mx-4 md:-mx-8 px-4 md:px-8 py-4 md:py-6 border-t border-[#7D7F82]/30 mt-8 z-50 shadow-[0_-20px_30px_-15px_rgba(0,0,0,0.3)]"
        style={{ backgroundColor: ThemeColors.bgBlue }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="ml-4 md:ml-12 border border-[#7D7F82]/40 focus-within:border-[#0950C3] rounded-2xl bg-black/10 overflow-hidden transition-all shadow-inner flex items-end p-2 pl-4 pr-2 pb-2 gap-3">
            <textarea 
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a thoughtful response..."
              rows={3}
              className="flex-1 bg-transparent text-white pt-3 pb-2 outline-none resize-none min-h-[72px] max-h-[150px] text-[15px] placeholder:text-zinc-600 self-stretch"
            />
            <button 
              onClick={handleReply}
              disabled={isReplying || !replyContent.trim()}
              className="bg-[#0950C3] hover:bg-[#3E5C8E] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 h-[42px] rounded-xl text-sm font-bold transition-all shadow-sm shrink-0 mb-0.5 mr-0.5"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
