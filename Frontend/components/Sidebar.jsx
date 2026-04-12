"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeColors } from "@/components/ThemeColors";
import client from "@/lib/client";

const roleMap = {
  0: "Admin",
  1: "Instructor",
  2: "Learner",
};

const decodeTokenRole = (token) => {
  try {
    const payloadBase64Url = token.split(".")[1];
    if (!payloadBase64Url) return "";

    const base64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));

    return (
      decoded.role ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      ""
    );
  } catch {
    return "";
  }
};

const normalizeRole = (roleValue) => {
  if (roleValue == null) return "Learner";

  if (typeof roleValue === "number") {
    return roleMap[roleValue] || "Learner";
  }

  const asNumber = Number(roleValue);
  if (!Number.isNaN(asNumber) && String(asNumber) === String(roleValue).trim()) {
    return roleMap[asNumber] || "Learner";
  }

  const text = String(roleValue).trim().toLowerCase();
  if (text === "admin") return "Admin";
  if (text === "instructor") return "Instructor";
  return "Learner";
};

const navSections = [
  {
    title: "MAIN",
    items: [
      { icon: "/assets/sidebar/dashboard_icon.svg", label: "Dashboard", href: "/dashboard", roles: ["Learner", "Instructor", "Admin"] },
      { icon: "/assets/sidebar/course_catalog_icon.svg", label: "Course Catalog", href: "/coursecatalog", roles: ["Learner", "Instructor", "Admin"] },
      { icon: "/assets/sidebar/assignment_icon.svg", label: "Assignments", href: "/assignments", roles: ["Learner"] },
      { icon: "/assets/sidebar/my_progress_icon.svg", label: "My Progress", href: "/progress", roles: ["Learner"] },
    ],
  },
  {
    title: "COMMUNITY",
    items: [
      { icon: "/assets/sidebar/discussions_icon.svg", label: "Discussions", href: "/discussion", roles: ["Learner", "Instructor", "Admin"] },
      { icon: "/assets/sidebar/my_team_icon.svg", label: "Users", href: "/users", roles: ["Admin"] },
      { icon: "/assets/sidebar/my_team_icon.svg", label: "My Team", href: "/teamallocation", roles: ["Learner"] },
      { icon: "/assets/sidebar/notification_icon.svg", label: "Notifications", href: "/notification", roles: ["Learner", "Instructor", "Admin"] },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { icon: "/assets/sidebar/profile_icon.svg", label: "Profile", href: "/profile", roles: ["Learner", "Instructor", "Admin"] },
      { icon: "/assets/sidebar/certificates_icon.svg", label: "Certificates", href: "/certificates", roles: ["Learner", "Instructor", "Admin"] },
    ],
  },
];

const Sidebar = ({ badges = {} }) => {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState("Learner");
  const [userData, setUserData] = useState({
    name: "User",
    initials: "U",
    publicId: "TMI-047",
    discipline: "UI/UX Intern",
  });
  const [loading, setLoading] = useState(true);

  const visibleNavSections = useMemo(() => {
    return navSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.roles.includes(userRole)),
      }))
      .filter((section) => section.items.length > 0);
  }, [userRole]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserRole(normalizeRole(parsedUser.role));
      } catch {
        setUserRole("Learner");
      }
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        setUserRole(normalizeRole(decodeTokenRole(token)));
      }
    }

    const fetchUserData = async () => {
      try {
        const response = await client.get("/Profile/me");
        if (response.data.success) {
          const profile = response.data.data;
          const fullName = profile.fullName || "User";
          const initials = fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);

          setUserData({
            name: fullName,
            initials,
            publicId: profile.publicId || "TMI-047",
            discipline: profile.personalInformation?.discipline || "UI/UX Intern",
          });
        }
      } catch (err) {
        console.error("Sidebar fetch error:", err);
        const storedUserFallback = localStorage.getItem("user");
        if (storedUserFallback) {
          try {
            const user = JSON.parse(storedUserFallback);
            setUserData((prev) => ({
              ...prev,
              name: user.fullName || "User",
              publicId: user.publicId || "TMI-047",
            }));
            setUserRole(normalizeRole(user.role));
          } catch {
            // keep defaults
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <aside
      id="sidebar-nav"
      className="flex flex-col items-start w-full min-w-[250px] border-r-[0.75px] border-[#7D7F82] h-screen sticky top-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", backgroundColor: ThemeColors.bgBlue }}
    >
      <div className="flex flex-col items-start gap-[clamp(12px,3vh,34px)] w-full">
        <div className="p-5 gap-[36px] w-full">
          <Image src="/logo.svg" alt="logo" width={500} height={500} className="w-10 h-10" />
        </div>

        <nav className="flex flex-col items-start px-[20px] gap-[clamp(12px,2.5vh,30px)] w-full box-border">
          {visibleNavSections.map((section) => (
            <div key={section.title} className="flex flex-col items-start gap-[clamp(10px,2vh,24px)] w-full">
              <h2 className="text-[clamp(12px,1.6vh,16px)] font-bold leading-[125%] text-[#0950C3] m-0">
                {section.title}
              </h2>

              <div className="flex flex-col items-start gap-[clamp(4px,1.5vh,20px)] w-full">
                {section.items.map((item) => {
                  const badgeCount = badges[item.label];
                  const showBadge = badgeCount != null && badgeCount > 0;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`flex flex-row items-center py-[clamp(4px,1vh,12px)] px-[10px] gap-[clamp(10px,2vw,33px)] w-full rounded-[12px] cursor-pointer transition-colors duration-200 border-none no-underline
                        ${isActive ? "bg-[#3E5C8E]" : "bg-transparent hover:bg-[#3E5C8E]/40"}
                        ${showBadge ? "justify-between" : ""}`}
                    >
                      <div className="flex flex-row items-center gap-[7px]">
                        <div className="w-[clamp(20px,2.5vh,32px)] h-[clamp(20px,2.5vh,32px)] flex items-center justify-center shrink-0">
                          <Image
                            src={item.icon}
                            alt={`${item.label} icon`}
                            width={32}
                            height={32}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-[clamp(12px,1.6vh,16px)] font-bold leading-[125%] text-center text-[#CEE0FD] whitespace-nowrap">
                          {item.label}
                        </span>
                      </div>

                      {showBadge && (
                        <div className="flex items-center justify-center w-[clamp(20px,2.5vh,32px)] h-[clamp(20px,2.5vh,32px)] bg-[#0950C3] rounded-full shrink-0">
                          <span className="text-[clamp(12px,1.6vh,16px)] font-bold leading-[125%] text-center text-white">
                            {badgeCount}
                          </span>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex flex-row items-center px-[10px] py-[clamp(8px,1vh,16px)] gap-[10px] w-full border-t-[0.75px] border-[#7D7F82] box-border mt-auto relative">
        <div className="w-[clamp(32px,3vh,48px)] h-[clamp(32px,3vh,48px)] bg-[#0950C3] rounded-full flex items-center justify-center shrink-0">
          <span className="text-[clamp(14px,1.5vh,20px)] font-bold leading-[125%] text-[#FAFCFF]">
            {loading ? ".." : userData.initials}
          </span>
        </div>
        <div className="flex flex-col items-start gap-[4px] flex-1 min-w-0">
          <p className="text-[clamp(14px,1.5vh,20px)] font-bold leading-[125%] text-[#FAFCFF] m-0 whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {loading ? "Loading..." : userData.name}
          </p>
          <p className="text-[clamp(11px,1.2vh,14px)] font-normal leading-[125%] text-[#FAFCFF] m-0 whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {userData.discipline}-{userData.publicId}
          </p>
        </div>
        <button id="settings-button" className="absolute top-[12px] right-[12px] w-[16px] h-[16px] flex items-center justify-center bg-transparent border-none p-0">
          <Image src="/assets/sidebar/setting_wheel_icon.svg" alt="Settings" width={16} height={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeColors } from "@/components/ThemeColors";
import client from "@/lib/client";

"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeColors } from "@/components/ThemeColors";
import client from "@/lib/client";

const roleMap = {
  0: "Admin",
  1: "Instructor",
  2: "Learner",
};

const decodeTokenRole = (token) => {
  try {
    const payloadBase64Url = token.split(".")[1];
    if (!payloadBase64Url) return "";

    const base64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));

    return (
      decoded.role ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      ""
    );
  } catch {
    return "";
  }
};

const normalizeRole = (roleValue) => {
  if (roleValue == null) return "Learner";

  if (typeof roleValue === "number") {
    return roleMap[roleValue] || "Learner";
  }

  const asNumber = Number(roleValue);
  if (!Number.isNaN(asNumber) && String(asNumber) === String(roleValue).trim()) {
    return roleMap[asNumber] || "Learner";
  }

  const text = String(roleValue).trim().toLowerCase();
  if (text === "admin") return "Admin";
  if (text === "instructor") return "Instructor";
  return "Learner";
};

const navSections = [
  {
    title: "MAIN",
    items: [
      { icon: "/assets/sidebar/dashboard_icon.svg", label: "Dashboard", href: "/dashboard", roles: ["Learner", "Instructor", "Admin"] },
      { icon: "/assets/sidebar/course_catalog_icon.svg", label: "Course Catalog", href: "/coursecatalog", roles: ["Learner", "Instructor", "Admin"] },
      { icon: "/assets/sidebar/assignment_icon.svg", label: "Assignments", href: "/assignments", roles: ["Learner"] },
      { icon: "/assets/sidebar/my_progress_icon.svg", label: "My Progress", href: "/progress", roles: ["Learner"] },
    ],
  },
  {
    title: "COMMUNITY",
    items: [
      { icon: "/assets/sidebar/discussions_icon.svg", label: "Discussions", href: "/discussion", roles: ["Learner", "Instructor", "Admin"] },
      { icon: "/assets/sidebar/my_team_icon.svg", label: "Users", href: "/users", roles: ["Admin"] },
      { icon: "/assets/sidebar/my_team_icon.svg", label: "My Team", href: "/teamallocation", roles: ["Learner"] },
      { icon: "/assets/sidebar/notification_icon.svg", label: "Notifications", href: "/notification", roles: ["Learner", "Instructor", "Admin"] },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { icon: "/assets/sidebar/profile_icon.svg", label: "Profile", href: "/profile", roles: ["Learner", "Instructor", "Admin"] },
      { icon: "/assets/sidebar/certificates_icon.svg", label: "Certificates", href: "/certificates", roles: ["Learner", "Instructor", "Admin"] },
    ],
  },
];

const Sidebar = ({ badges = {} }) => {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState("Learner");
  const [userData, setUserData] = useState({
      name: "User",
    initials: "U",
    publicId: "TMI-047", 
    discipline: "UI/UX Intern" 
  });
  const [loading, setLoading] = useState(true);

  const visibleNavSections = useMemo(() => {
    return navSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.roles.includes(userRole)),
      }))
      .filter((section) => section.items.length > 0);
  }, [userRole]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserRole(normalizeRole(parsedUser.role));
      } catch {
        setUserRole("Learner");
      }
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        setUserRole(normalizeRole(decodeTokenRole(token)));
      }
    }

    const fetchUserData = async () => {
      try {
        const response = await client.get("/Profile/me");
        if (response.data.success) {
          const profile = response.data.data;
          const fullName = profile.fullName || "User";
          const initials = fullName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);

          setUserData({
            name: fullName,
            initials: initials,
            publicId: profile.publicId || "TMI-047",
            discipline: profile.personalInformation?.discipline || "UI/UX Intern"
          });
        }
      } catch (err) {
        console.error("Sidebar fetch error:", err);
        const storedUserFallback = localStorage.getItem("user");
        if (storedUserFallback) {
          const user = JSON.parse(storedUserFallback);
          setUserData(prev => ({
            ...prev,
            name: user.fullName || "User",
            publicId: user.publicId || "TMI-047"
          }));
          setUserRole(normalizeRole(user.role));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <aside
      id="sidebar-nav"
      className="flex flex-col items-start w-full min-w-[250px] border-r-[0.75px] border-[#7D7F82] h-screen sticky top-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", backgroundColor: ThemeColors.bgBlue }}
    >
      <div className="flex flex-col items-start gap-[clamp(12px,3vh,34px)] w-full">
        <div className="p-5 gap-[36px] w-full">
          <Image src={"/logo.svg"} alt="logo" width={500} height={500} className="w-10 h-10" />
        </div>

        <nav className="flex flex-col items-start px-[20px] gap-[clamp(12px,2.5vh,30px)] w-full box-border">
          {visibleNavSections.map((section) => (
            <div key={section.title} className="flex flex-col items-start gap-[clamp(10px,2vh,24px)] w-full">
              <h2 className="text-[clamp(12px,1.6vh,16px)] font-bold leading-[125%] text-[#0950C3] m-0">
                {section.title}
              </h2>

              <div className="flex flex-col items-start gap-[clamp(4px,1.5vh,20px)] w-full">
                {section.items.map((item) => {
                  const badgeCount = badges[item.label];
                  const showBadge = badgeCount != null && badgeCount > 0;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`flex flex-row items-center py-[clamp(4px,1vh,12px)] px-[10px] gap-[clamp(10px,2vw,33px)] w-full rounded-[12px] cursor-pointer transition-colors duration-200 border-none no-underline
                        ${isActive ? "bg-[#3E5C8E]" : "bg-transparent hover:bg-[#3E5C8E]/40"}
                        ${showBadge ? "justify-between" : ""}`}
                    >
                      <div className="flex flex-row items-center gap-[7px]">
                        <div className="w-[clamp(20px,2.5vh,32px)] h-[clamp(20px,2.5vh,32px)] flex items-center justify-center shrink-0">
                          <Image
                            src={item.icon}
                            alt={`${item.label} icon`}
                            width={32}
                            height={32}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-[clamp(12px,1.6vh,16px)] font-bold leading-[125%] text-center text-[#CEE0FD] whitespace-nowrap">
                          {item.label}
                        </span>
                      </div>

                      {showBadge && (
                        <div className="flex items-center justify-center w-[clamp(20px,2.5vh,32px)] h-[clamp(20px,2.5vh,32px)] bg-[#0950C3] rounded-full shrink-0">
                          <span className="text-[clamp(12px,1.6vh,16px)] font-bold leading-[125%] text-center text-white">
                            {badgeCount}
                          </span>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex flex-row items-center px-[10px] py-[clamp(8px,1vh,16px)] gap-[10px] w-full border-t-[0.75px] border-[#7D7F82] box-border mt-auto relative">
        <div className="w-[clamp(32px,3vh,48px)] h-[clamp(32px,3vh,48px)] bg-[#0950C3] rounded-full flex items-center justify-center shrink-0">
          <span className="text-[clamp(14px,1.5vh,20px)] font-bold leading-[125%] text-[#FAFCFF]">
            {loading ? ".." : userData.initials}
          </span>
        </div>
        <div className="flex flex-col items-start gap-[4px] flex-1 min-w-0">
          <p className="text-[clamp(14px,1.5vh,20px)] font-bold leading-[125%] text-[#FAFCFF] m-0 whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {loading ? "Loading..." : userData.name}
          </p>
          <p className="text-[clamp(11px,1.2vh,14px)] font-normal leading-[125%] text-[#FAFCFF] m-0 whitespace-nowrap overflow-hidden text-ellipsis w-full">
            {userData.discipline}-{userData.publicId}
          </p>
        </div>
        <button id="settings-button" className="absolute top-[12px] right-[12px] w-[16px] h-[16px] flex items-center justify-center bg-transparent border-none p-0">
          <Image src="/assets/sidebar/setting_wheel_icon.svg" alt="Settings" width={16} height={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;