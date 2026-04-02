import Image from "next/image";
import Link from "next/link";
import { ThemeColors } from "@/components/ThemeColors";

/* Navigation sections data */
const navSections = [
  {
    title: "MAIN",
    items: [
      { icon: "/assets/sidebar/dashboard_icon.svg", label: "Dashboard", href: "/dashboard" },
      { icon: "/assets/sidebar/course_catalog_icon.svg", label: "Course Catalog", href: "/coursecatalog" },
      { icon: "/assets/sidebar/assignment_icon.svg", label: "Assignments", href: "/assignments" },
      { icon: "/assets/sidebar/my_progress_icon.svg", label: "My Progress", href: "/dashboard" },
    ],
  },
  {
    title: "COMMUNITY",
    items: [
      { icon: "/assets/sidebar/discussions_icon.svg", label: "Discussions", href: "/discussion" },
      { icon: "/assets/sidebar/my_team_icon.svg", label: "My Team", href: "/teamallocation" },
      { icon: "/assets/sidebar/notification_icon.svg", label: "Notifications", href: "/notification" },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { icon: "/assets/sidebar/profile_icon.svg", label: "Profile", href: "/profile" },
      { icon: "/assets/sidebar/certificates_icon.svg", label: "Certificates", href: "/dashboard" },
    ],
  },
];

/* Sidebar component — renders the full left navigation panel */
const Sidebar = ({ badges = {}, activeTab = "Dashboard" }) => {
  return (
    <aside
      id="sidebar-nav"
      className="flex flex-col items-start w-[25.26vw] min-w-[250px] border-r-[0.75px] border-[#7D7F82] h-screen sticky top-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif", backgroundColor: ThemeColors.bgBlue }}
    >
      {/* Top navigation section */}
      <div className="flex flex-col items-start gap-[clamp(12px,3vh,34px)] w-full">
        {/* Logo header */}
        <div className="flex flex-row items-center px-[10px] py-[clamp(10px,2vh,24px)] gap-[36px] w-full">
          <h1 className="text-[clamp(24px,2.08vw,40px)] font-bold leading-[125%] text-[#FAFCFF] flex-1 flex items-center">
            Talent<span className="text-[#0950C3]">Flow</span>
          </h1>
        </div>

        {/* Navigation items container */}
        <nav className="flex flex-col items-start px-[20px] gap-[clamp(12px,2.5vh,30px)] w-full box-border">
          {navSections.map((section) => (
            <div
              key={section.title}
              className="flex flex-col items-start gap-[clamp(10px,2vh,24px)] w-full"
            >
              {/* Section title (MAIN, COMMUNITY, ACCOUNT) */}
              <h2 className="text-[clamp(12px,1.6vh,16px)] font-bold leading-[125%] text-[#0950C3] m-0">
                {section.title}
              </h2>

              {/* Section nav links */}
              <div className="flex flex-col items-start gap-[clamp(4px,1.5vh,20px)] w-full">
                {section.items.map((item) => {
                  /* Look up dynamic badge count for this nav item */
                  const badgeCount = badges[item.label];
                  const showBadge = badgeCount != null && badgeCount > 0;
                  const isActive = item.label === activeTab;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`flex flex-row items-center py-[clamp(4px,1vh,12px)] px-[10px] gap-[clamp(10px,2vw,33px)] w-full rounded-[12px] cursor-pointer transition-colors duration-200 border-none no-underline
                        ${isActive ? "bg-[#3E5C8E] hover:bg-[#3E5C8E]" : "bg-transparent hover:bg-[#3E5C8E]/40"}
                        ${showBadge ? "justify-between" : ""}`}
                    >
                      {/* Icon + label group */}
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

                      {/* Notification badge — dynamically rendered */}
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

      {/* Bottom user profile section */}
      <div className="flex flex-row items-center px-[10px] py-[clamp(8px,1vh,16px)] gap-[10px] w-full border-t-[0.75px] border-[#7D7F82] box-border mt-auto relative">
        {/* Avatar circle with initials */}
        <div className="w-[clamp(32px,3vh,48px)] h-[clamp(32px,3vh,48px)] bg-[#0950C3] rounded-full flex items-center justify-center shrink-0">
          <span className="text-[clamp(14px,1.5vh,20px)] font-bold leading-[125%] text-[#FAFCFF]">
            AO
          </span>
        </div>

        {/* User name and role */}
        <div className="flex flex-col items-start gap-[4px] flex-1 min-w-0">
          <p className="text-[clamp(14px,1.5vh,20px)] font-bold leading-[125%] text-[#FAFCFF] m-0 whitespace-nowrap overflow-hidden text-ellipsis w-full">
            Adeeze okoro
          </p>
          <p className="text-[clamp(11px,1.2vh,14px)] font-normal leading-[125%] text-[#FAFCFF] m-0 whitespace-nowrap overflow-hidden text-ellipsis w-full">
            UI/UX Intern-TMI-047
          </p>
        </div>

        {/* Settings icon — top-right corner */}
        <button
          id="settings-button"
          aria-label="Settings"
          className="absolute top-[12px] right-[12px] w-[16px] h-[16px] flex items-center justify-center cursor-pointer bg-transparent border-none p-0"
        >
          <Image
            src="/assets/sidebar/setting_wheel_icon.svg"
            alt="Settings"
            width={16}
            height={16}
            className="w-full h-full object-contain"
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
