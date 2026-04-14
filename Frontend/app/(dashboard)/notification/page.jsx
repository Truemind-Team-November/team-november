"use client";

<<<<<<< HEAD
import { useEffect, useMemo, useState } from "react";
=======
import { useState, useEffect } from "react";
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
import Image from "next/image";
import Link from "next/link";
import { ThemeColors } from "@/components/ThemeColors";
<<<<<<< HEAD
=======
import Spinner from "@/components/Spinner";
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
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
<<<<<<< HEAD
  const date = new Date(dateString);
  const diffInHours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
=======
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
  
>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "1 day ago";
  return `${diffInDays} days ago`;
}

<<<<<<< HEAD
function NotificationItem({ notif, onRead }) {
  const typeKey = typeof notif.type === "string" ? notif.type : "System";

  return (
    <button
      type="button"
      onClick={() => onRead(notif)}
      className={`relative w-full flex items-center px-6 py-0 border-b transition-all duration-200 cursor-pointer group hover:bg-black/20 ${notif.isRead ? "bg-transparent" : "bg-[#131d2e]"}`}
=======
function NotificationItem({ notif, onMarkRead }) {
  return (
    <Link
      href={notif.actionUrl || "#"}
      onClick={() => {
        if (!notif.isRead) onMarkRead(notif.id);
      }}
      className={`relative flex items-center px-6 py-0 border-b transition-all duration-200 cursor-pointer group hover:bg-black/20 no-underline ${notif.isRead ? "bg-transparent" : "bg-[#131d2e]"}`}
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
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
<<<<<<< HEAD
    </button>
=======
    </Link>
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
  );
}

async function fetchNotifications() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${client.defaults.baseURL}/Notification`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications (${response.status})`);
  }

  const data = await response.json();
  return data.data ?? data;
}

async function fetchUnreadNotificationsCount() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${client.defaults.baseURL}/Notification/unread-count`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch unread count (${response.status})`);
  }

  const data = await response.json();
  return data.data ?? data;
}

async function markAllNotificationsRead() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${client.defaults.baseURL}/Notification/read-all`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to mark notifications as read (${response.status})`,
    );
  }

  return response.json();
}

async function markNotificationRead(notificationId) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${client.defaults.baseURL}/Notification/${notificationId}/read`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to mark notification as read (${response.status})`);
  }

  return response.json();
}
export default function NotificationsPage() {
<<<<<<< HEAD
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
=======
  const [notificationList, setNotificationList] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function loadNotifications() {
    setLoading(true);
    setError(null);

    fetchNotifications()
      .then(setNotificationList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    fetchUnreadNotificationsCount()
      .then(setUnreadNotificationCount)
      .catch(console.error);
  }
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1

  useEffect(() => {
    loadNotifications();
  }, []);

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
  // Sync state to localStorage for Sidebar instant updates
  useEffect(() => {
    localStorage.setItem("unreadNotificationCount", unreadNotificationCount);
    // Dispatch storage event manually for same-tab updates if needed
    window.dispatchEvent(new Event("storage"));
  }, [unreadNotificationCount]);

>>>>>>> 76435d7df82bb9102461d7ab91f5ce9cdfd7423d
  const newCount = notificationList.filter((n) => !n.isRead).length;

  function handleMarkRead(notificationId) {
    setNotificationList((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
    );
    setUnreadNotificationCount((prev) => Math.max(0, prev - 1));
    markNotificationRead(notificationId).catch(console.error);
  }

  return (
    <main
      className=""
      style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}
    >
      <div
        className="min-h-screen w-full"
        style={{ backgroundColor: ThemeColors.bgBlue }}
      >
        {/* Main container — max 1436px, full width on tablet */}
        <div
          className="mx-auto w-full"
          style={{
            maxWidth: 1436,
            borderLeft: "0.75px solid #7D7F82",
            borderRight: "0.75px solid #7D7F82",
          }}
        >
          {/* ── Header ── */}
          <div
            className="flex flex-row items-center justify-between px-5 sm:px-6"
            style={{
              height: 98,
              background: "transparent",
              borderBottom: "0.75px solid #D6E3F5",
            }}
          >
            <h1
              className="font-bold text-white"
              style={{ fontSize: "clamp(24px, 3vw, 40px)", lineHeight: "125%" }}
            >
              Notifications
            </h1>

            {/* Mark all read button — hidden while loading or when empty */}
            {!loading && notificationList.length > 0 && (
              <div className="relative">
                <button
                  onClick={async () => {
                    try {
                      await markAllNotificationsRead();
                      setNotificationList((prev) =>
                        prev.map((n) => ({ ...n, isRead: true })),
                      );
                      setUnreadNotificationCount(0);
                    } catch (err) {
                      setError(err.message);
                    }
                  }}
                  className="flex items-center justify-center font-bold text-white rounded-lg transition-colors duration-150 hover:bg-[#5a5b5d] cursor-pointer"
                  style={{
                    padding: "0 16px",
                    height: 40,
                    minWidth: 120,
                    background: "#4B4C4E",
                    border: "1px solid #D6E3F5",
                    borderRadius: 8,
                    fontSize: 14,
                    whiteSpace: "nowrap",
                  }}
                >
                  Mark all read
                </button>

                {unreadNotificationCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold"
                    style={{ width: 22, height: 22, fontSize: 11 }}
                  >
                    {unreadNotificationCount}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ── Notification list ── */}
          <div className="flex flex-col" style={{ borderLeft: "none" }}>
            {loading && <Spinner message="Loading notifications..." />}

            {error && (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-98px)] gap-4">
                <span className="text-[#7D7F82] text-base font-medium">
                  Something went wrong while loading your notifications.
                </span>
                <button
                  onClick={loadNotifications}
                  className="flex items-center justify-center font-bold text-white rounded-lg transition-colors duration-150 hover:bg-[#0950C3]/80 cursor-pointer"
                  style={{
                    padding: "0 20px",
                    height: 40,
                    background: "#0950C3",
                    borderRadius: 8,
                    fontSize: 14,
                    border: "none",
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && notificationList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Image
                  src="/assets/notifications/notification_icon.svg"
                  alt="No notifications"
                  width={48}
                  height={48}
                  className="opacity-40"
                />
                <span className="text-[#7D7F82] text-base font-medium">
                  You're all caught up — no notifications right now.
                </span>
              </div>
            )}

            {!loading &&
              !error &&
              notificationList.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notif={notif}
                  onMarkRead={handleMarkRead}
                />
              ))}
          </div>
>>>>>>> f0f6b8a8965a8ac6cc9e8f7541277bc6c2d05cd1
        </div>
      </div>
    </main>
  );
}
