"use client";
import Sidebar from "@/components/SideBar";
import Image from "next/image";
import { ThemeColors } from "@/components/ThemeColors";

const iconMap = {
  assignment_due: "/assets/notifications/assignment-due.svg",
  graded: "/assets/notifications/assignment-graded.svg",
  reply: "/assets/notifications/reply-icon.svg",
  lesson: "/assets/notifications/new-lesson-icon.svg",
  team: "/assets/notifications/team-update-icon.svg",
  certificate: "/assets/notifications/trophy-icon.svg",
  System: "/assets/notifications/team-update-icon.svg",
};

function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date("2026-03-31T15:00:00Z"); // Using current approximate time as base
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
}

const notifications = [
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa1",
    type: "assignment_due",
    title: "Assignment Due in 2 Days",
    message: "Wireframe Challenge #3 is due on Feb 26. Submit before midnight.",
    actionUrl: "/dashboard",
    isRead: false,
    createdAt: "2026-03-31T14:00:00.000Z",
    readAt: null,
  },
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa2",
    type: "graded",
    title: "Assignment Graded — 88/100",
    message:
      "Emeka Obi graded your Sprint Retrospective Report. View feedback.",
    actionUrl: "/dashboard",
    isRead: false,
    createdAt: "2026-03-31T13:00:00.000Z",
    readAt: null,
  },
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa3",
    type: "reply",
    title: "Reply on your Discussion Post",
    message:
      "Fatima Aliyu replied: 'Have you tried the Colour Contrast Analyser tool? It's WCAG compliant!'",
    actionUrl: "/discussion",
    isRead: false,
    createdAt: "2026-03-31T12:00:00.000Z",
    readAt: null,
  },
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa4",
    type: "lesson",
    title: "New Lessons Available",
    message:
      "Lesson 4: Design Systems has been unlocked in UI/UX Fundamentals.",
    actionUrl: "/coursecatalog",
    isRead: true,
    createdAt: "2026-03-30T15:00:00.000Z",
    readAt: "2026-03-31T10:00:00.000Z",
  },
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa5",
    type: "team",
    title: "Team Update",
    message:
      "You have been added to the Design & Engineering cross-functional team.",
    actionUrl: "/teamallocation",
    isRead: true,
    createdAt: "2026-03-29T15:00:00.000Z",
    readAt: "2026-03-30T08:00:00.000Z",
  },
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    type: "certificate",
    title: "Certificate Milestone",
    message:
      "You're 28% away from completing UI/UX Fundamentals and earning your certificate!",
    actionUrl: "/dashboard",
    isRead: true,
    createdAt: "2026-03-28T15:00:00.000Z",
    readAt: "2026-03-29T12:00:00.000Z",
  },
];

function NotificationItem({ notif, index }) {
  return (
    <div
      className={`relative flex items-center px-6 py-0 border-b transition-all duration-200 cursor-pointer group hover:bg-black/20 ${notif.isRead ? "bg-transparent" : "bg-[#131d2e]"}`}
      style={{
        height: "117px",
        borderColor: "#D6E3F5",
        borderBottomWidth: "0.5px",
      }}
    >
      {/* Green tint overlay for new notifications */}
      {!notif.isRead && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "#06580D", opacity: 0.1 }}
        />
      )}

      {/* Content row */}
      <div className="relative flex items-center gap-6 flex-1 min-w-0">
        {/* Icon box */}
        <div
          className="shrink-0 flex items-center justify-center rounded-lg"
          style={{ width: 32, height: 32, background: "#314568" }}
        >
          <Image
            src={iconMap[notif.type] || iconMap["System"]}
            alt={notif.type}
            width={20}
            height={20}
            className="w-auto h-auto"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <span
            className="font-bold text-white truncate"
            style={{
              fontSize: 16,
              lineHeight: "125%",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {notif.title}
          </span>
          <span
            className="truncate md:whitespace-normal"
            style={{
              fontSize: 16,
              lineHeight: "125%",
              color: "#7D7F82",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {notif.message}
          </span>
          <span
            style={{
              fontSize: 12,
              lineHeight: "125%",
              color: "#7D7F82",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {formatTime(notif.createdAt)}
          </span>
        </div>
      </div>

      {/* Green dot for unread */}
      {!notif.isRead && (
        <div
          className="relative shrink-0 ml-4"
          style={{ width: 18, height: 18 }}
        >
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: "rgba(0,128,0,0.3)" }}
          />
          {/* Inner dot */}
          <div
            className="absolute rounded-full"
            style={{
              width: 10,
              height: 10,
              background: "#008000",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const newCount = notifications.filter((n) => !n.isRead).length;

  return (
    <main
      className=""
      style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}
    >
      <div className="min-h-screen w-full" style={{ backgroundColor: ThemeColors.bgBlue }}>
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

            {/* Mark all read button */}
            <button
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
          </div>

          {/* ── Notification list ── */}
          <div className="flex flex-col" style={{ borderLeft: "none" }}>
            {notifications.map((notif, i) => (
              <NotificationItem key={notif.id} notif={notif} index={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
