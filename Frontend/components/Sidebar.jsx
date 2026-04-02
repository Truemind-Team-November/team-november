'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './sidebar.module.css';

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
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoText}>Talent</span>
          <span className={styles.logoAccent}>Flow</span>
        </div>
        <button
          className={styles.collapseBtn}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className={styles.nav}>
        {navSections.map((section) => (
          <div key={section.title} className={styles.navSection}>
            <p className={styles.navSectionTitle}>{section.title}</p>
            <ul className={styles.navList}>
              {section.items.map((item) => (
                <li key={item.id} className={styles.navItem}>
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <span className={styles.navIcon} role="img" aria-label={item.label}>
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
                    {!isCollapsed && item.badge && (
                      <span className={styles.badge}>{item.badge}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={styles.userCard}>
        <div className={styles.userAvatar}>AO</div>
        {!isCollapsed && (
          <>
            <div className={styles.userName}>Adeeze okoro</div>
            <div className={styles.userRole}>UI/UX Intern</div>
          </>
        )}
      </div>
    </aside>
  );
}
