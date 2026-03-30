import Image from "next/image";

/* Navigation sections data */
const navSections = [
  {
    title: "MAIN",
    items: [
      { icon: "/assets/sidebar/dashboard_icon.svg", label: "Dashboard" },
      { icon: "/assets/sidebar/course_catalog_icon.svg", label: "Course Catalog" },
      { icon: "/assets/sidebar/assignment_icon.svg", label: "Assignments" },
      { icon: "/assets/sidebar/my_progress_icon.svg", label: "My Progress" },
    ],
  },
  {
    title: "COMMUNITY",
    items: [
      { icon: "/assets/sidebar/discussions_icon.svg", label: "Discussions" },
      { icon: "/assets/sidebar/my_team_icon.svg", label: "My Team" },
      { icon: "/assets/sidebar/notification_icon.svg", label: "Notifications" },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { icon: "/assets/sidebar/profile_icon.svg", label: "Profile" },
      { icon: "/assets/sidebar/certificates_icon.svg", label: "Certificates" },
    ],
  },
];

/* Sidebar component — renders the full left navigation panel */
const Sidebar = ({ badges = {}, activeTab = "Dashboard" }) => {
  return (
    <aside
      id="sidebar-nav"
      className="flex flex-col items-start w-[25.26vw] min-w-[250px] gap-[100px] bg-[#101723] border-r-[0.75px] border-[#7D7F82]"
      style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}
    >
      {/* Top navigation section */}
      <div className="flex flex-col items-start gap-[34px] w-full">
        {/* Logo header */}
        <div className="flex flex-row items-center px-[10px] py-[24px] gap-[36px] w-full">
          <h1 className="text-[clamp(24px,2.08vw,40px)] font-bold leading-[125%] text-[#FAFCFF] flex-1 flex items-center">
            Talent<span className="text-[#0950C3]">Flow</span>
          </h1>
        </div>

        {/* Navigation items container */}
        <nav className="flex flex-col items-start px-[20px] gap-[30px] w-full box-border">
          {navSections.map((section) => (
            <div
              key={section.title}
              className="flex flex-col items-start gap-[24px] w-full"
            >
              {/* Section title (MAIN, COMMUNITY, ACCOUNT) */}
              <h2 className="text-[16px] font-bold leading-[125%] text-[#0950C3] m-0">
                {section.title}
              </h2>

              {/* Section nav links */}
              <div className="flex flex-col items-start gap-[20px] w-full">
                {section.items.map((item) => {
                  /* Look up dynamic badge count for this nav item */
                  const badgeCount = badges[item.label];
                  const showBadge = badgeCount != null && badgeCount > 0;
                  const isActive = item.label === activeTab;

                  return (
                    <button
                      key={item.label}
                      id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`flex flex-row items-center py-[12px] px-[10px] gap-[33px] w-full rounded-[12px] cursor-pointer transition-colors duration-200 border-none
                        ${isActive ? "bg-[#3E5C8E] hover:bg-[#3E5C8E]" : "bg-transparent hover:bg-[#3E5C8E]/40"}
                        ${showBadge ? "justify-between" : ""}`}
                    >
                      {/* Icon + label group */}
                      <div className="flex flex-row items-center gap-[7px]">
                        <div className="w-[32px] h-[32px] flex items-center justify-center shrink-0">
                          <Image
                            src={item.icon}
                            alt={`${item.label} icon`}
                            width={32}
                            height={32}
                          />
                        </div>
                        <span className="text-[16px] font-bold leading-[125%] text-center text-[#CEE0FD] whitespace-nowrap">
                          {item.label}
                        </span>
                      </div>

                      {/* Notification badge — dynamically rendered */}
                      {showBadge && (
                        <div className="flex items-center justify-center w-[32px] h-[32px] bg-[#0950C3] rounded-full shrink-0">
                          <span className="text-[16px] font-bold leading-[125%] text-center text-white">
                            {badgeCount}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom user profile section */}
      <div className="flex flex-row items-center px-[10px] py-[24px] gap-[14px] w-full border-t-[0.75px] border-[#7D7F82] box-border mt-auto relative">
        {/* Avatar circle with initials */}
        <div className="w-[clamp(48px,4.17vw,80px)] h-[clamp(48px,4.17vw,80px)] bg-[#0950C3] rounded-full flex items-center justify-center shrink-0">
          <span className="text-[clamp(20px,2.08vw,40px)] font-bold leading-[125%] text-[#FAFCFF]">
            AO
          </span>
        </div>

        {/* User name and role */}
        <div className="flex flex-col items-start gap-[9px] flex-1 min-w-0">
          <p className="text-[clamp(20px,2.08vw,40px)] font-bold leading-[125%] text-[#FAFCFF] m-0 whitespace-nowrap overflow-hidden text-ellipsis w-full">
            Adeeze okoro
          </p>
          <p className="text-[clamp(16px,1.72vw,33px)] font-normal leading-[125%] text-[#FAFCFF] m-0 whitespace-nowrap overflow-hidden text-ellipsis w-full">
            UI/UX Intern-TMI-047
          </p>
        </div>

        {/* Settings icon — top-right corner */}
        <button
          id="settings-button"
          aria-label="Settings"
          className="absolute top-[12px] right-[12px] w-[20px] h-[20px] flex items-center justify-center cursor-pointer bg-transparent border-none p-0"
        >
          <Image
            src="/assets/sidebar/setting_wheel_icon.svg"
            alt="Settings"
            width={20}
            height={20}
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
