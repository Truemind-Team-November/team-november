"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ThemeColors } from "@/components/ThemeColors";
import client from "@/lib/client";

const iconMap = {
  AssignmentDue: "/assets/notifications/assignment-due.svg",
  AssignmentGraded: "/assets/notifications/assignment-graded.svg",
  DiscussionReply: "/assets/notifications/reply-icon.svg",
  LessonUnlocked: "/assets/notifications/new-lesson-icon.svg",
  TeamUpdate: "/assets/notifications/team-update-icon.svg",
  CertificateMilestone: "/assets/notifications/trophy-icon.svg",
  System: "/assets/notifications/team-update-icon.svg",
};

function formatTime(dateString) {
  const date = new Date(dateString);
  const diffInHours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
}

function NotificationItem({ notif, onRead }) {
  const typeKey = typeof notif.type === "string" ? notif.type : "System";

  return (
    <button
      type="button"
      onClick={() => onRead(notif)}
      className={`relative w-full flex items-center px-6 py-0 border-b transition-all duration-200 cursor-pointer group hover:bg-black/20 ${notif.isRead ? "bg-transparent" : "bg-[#131d2e]"}`}
      style={{
        minHeight: "117px",
        borderColor: "#D6E3F5",
        borderBottomWidth: "0.5px",
      }}
    >
      {!notif.isRead && <div className="absolute inset-0 pointer-events-none" style={{ background: "#06580D", opacity: 0.1 }} />}

      <div className="relative flex items-center gap-6 flex-1 min-w-0 text-left">
        <div className="shrink-0 flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: "#314568" }}>
          <Image src={iconMap[typeKey] || iconMap.System} alt={typeKey} width={20} height={20} className="w-auto h-auto" />
        </div>

        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <span className="font-bold text-white truncate" style={{ fontSize: 16, lineHeight: "125%", fontFamily: "'DM Sans', sans-serif" }}>
            {notif.title}
          </span>
          <span className="truncate md:whitespace-normal" style={{ fontSize: 16, lineHeight: "125%", color: "#7D7F82", fontFamily: "'DM Sans', sans-serif" }}>
            {notif.message}
          </span>
          <span style={{ fontSize: 12, lineHeight: "125%", color: "#7D7F82", fontFamily: "'DM Sans', sans-serif" }}>
            {formatTime(notif.createdAt)}
          </span>
        </div>
      </div>

      {!notif.isRead && (
        <div className="relative shrink-0 ml-4" style={{ width: 18, height: 18 }}>
          <div className="absolute inset-0 rounded-full border" style={{ borderColor: "rgba(0,128,0,0.3)" }} />
          <div className="absolute rounded-full" style={{ width: 10, height: 10, background: "#008000", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
        </div>
      )}
    </button>
  );
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await client.get("/Notification");
      setNotifications(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Notification fetch error:", err);
      setError("Unable to load notifications right now.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const newCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const markOneRead = async (notif) => {
    if (notif.isRead) return;
    try {
      await client.put(`/Notification/${notif.id}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)));
    } catch (err) {
      console.error("Mark as read failed:", err);
    }
  };

  const markAllRead = async () => {
    try {
      await client.put("/Notification/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: n.readAt || new Date().toISOString() })));
    } catch (err) {
      console.error("Mark all read failed:", err);
    }
  };

  return (
    <main style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}>
      <div className="min-h-screen w-full" style={{ backgroundColor: ThemeColors.bgBlue }}>
        <div className="mx-auto w-full" style={{ maxWidth: 1436, borderLeft: "0.75px solid #7D7F82", borderRight: "0.75px solid #7D7F82" }}>
          <div className="flex flex-row items-center justify-between px-5 sm:px-6" style={{ height: 98, borderBottom: "0.75px solid #D6E3F5" }}>
            <h1 className="font-bold text-white" style={{ fontSize: "clamp(24px, 3vw, 40px)", lineHeight: "125%" }}>
              Notifications {newCount > 0 ? `(${newCount} new)` : ""}
            </h1>

            <button
              onClick={markAllRead}
              disabled={loading || notifications.length === 0 || newCount === 0}
              className="flex items-center justify-center font-bold text-white rounded-lg transition-colors duration-150 hover:bg-[#5a5b5d] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ padding: "0 16px", height: 40, minWidth: 120, background: "#4B4C4E", border: "1px solid #D6E3F5", borderRadius: 8, fontSize: 14, whiteSpace: "nowrap" }}
            >
              Mark all read
            </button>
          </div>

          {loading && <div className="p-6 text-sm text-zinc-300">Loading notifications...</div>}
          {error && <div className="p-6 text-sm text-red-300">{error}</div>}

          {!loading && !error && notifications.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-xl font-bold text-white mb-2">No notifications</p>
              <p className="text-sm text-zinc-400">You are all caught up.</p>
            </div>
          )}

          {!loading && !error && notifications.length > 0 && (
            <div className="flex flex-col" style={{ borderLeft: "none" }}>
              {notifications.map((notif) => (
                <NotificationItem key={notif.id} notif={notif} onRead={markOneRead} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
