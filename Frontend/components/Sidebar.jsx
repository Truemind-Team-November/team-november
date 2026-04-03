'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navSections = [
  {
    title: 'MAIN',
    items: [
      { id: '1', label: 'Dashboard', href: '/dashboard', icon: '📊' },
      { id: '2', label: 'Course Catalog', href: '/courses', icon: '📚' },
      { id: '3', label: 'Assignments', href: '/assignments', icon: '✓', badge: 3 },
      { id: '4', label: 'My Progress', href: '/progress', icon: '📈' },
    ],
  },
  {
    title: 'COMMUNITY',
    items: [
      { id: '5', label: 'Discussions', href: '/discussions', icon: '💬', badge: 7 },
      { id: '6', label: 'My Team', href: '/team', icon: '👥' },
      { id: '7', label: 'Notifications', href: '/notifications', icon: '🔔' },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { id: '8', label: 'Profile', href: '/profile', icon: '👤' },
      { id: '9', label: 'Certificates', href: '/certificates', icon: '🏆' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside
      className={`sticky top-0 z-50 flex h-screen flex-col overflow-y-auto border-r border-[#4B4C4E] bg-[#101723] p-4 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}
    >
      <div className="mb-8 flex items-center justify-between gap-2">
        <div className={`flex min-w-0 gap-1 font-bold tracking-tight ${isCollapsed ? 'text-lg' : 'text-2xl'}`}>
          <span className="text-white">Talent</span>
          <span className="text-[#0950C3]">Flow</span>
        </div>
        <button
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#4FACFE]/40 bg-[#4FACFE]/10 text-sm font-semibold text-[#4FACFE] transition hover:bg-[#4FACFE]/20"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-6">
        {navSections.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[1px] text-[#0950C3]">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`relative flex min-h-10 items-center rounded-lg px-3 text-[13px] font-medium transition ${isCollapsed ? 'justify-center' : 'gap-3'} ${isActive(item.href) ? 'border-l-4 border-[#4FACFE] bg-[#3E5C8E] text-[#CEE0FD]' : 'text-[#A0A9B3] hover:bg-[#4FACFE]/10 hover:text-[#4FACFE]'}`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <span className="flex w-5 shrink-0 items-center justify-center text-base" role="img" aria-label={item.label}>
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!isCollapsed && item.badge && (
                      <span className="ml-auto min-w-5 rounded bg-[#0950C3] px-1.5 py-0.5 text-center text-[11px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-2 rounded-[10px] border border-[#4FACFE]/20 bg-[#4FACFE]/10 p-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0950C3] text-lg font-bold text-white">
          AO
        </div>
        {!isCollapsed && (
          <>
            <div className="truncate text-[13px] font-bold text-white">Adeeze okoro</div>
            <div className="truncate text-[11px] text-[#A0A9B3]">UI/UX Intern</div>
          </>
        )}
      </div>
    </aside>
  );
}
