'use client';

import React, { useState } from 'react';
import styles from './profile.module.css';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  userId: string;
  role: string;
  location: string;
  tags: string[];
  courses: number;
  avgProgress: number;
  certificates: number;
  avgScore: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const defaultProfile: UserProfile = {
  id: '1',
  fullName: 'Adeeze Okoro',
  email: 'adeeze@learntlm.org',
  phoneNumber: '+2342324456789',
  userId: 'TMI-2025-047',
  role: 'UI/UX Design Intern',
  location: 'Cohort 3 - Lagos, Nigeria',
  tags: ['UI/UX Design', 'Week 6', 'Top Contributor'],
  courses: 4,
  avgProgress: 68,
  certificates: 2,
  avgScore: 88,
  achievements: [
    {
      id: '1',
      icon: '🔥',
      title: '7-Day Streak',
      description: 'Logged in 7 days in a row',
    },
    {
      id: '2',
      icon: '⚪',
      title: 'Top Contributor',
      description: '31 discussion posts',
    },
    {
      id: '3',
      icon: '⭐',
      title: 'High Scorer',
      description: 'Achieved top scores in assessments',
    },
  ],
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    email: profile.email,
    phoneNumber: profile.phoneNumber,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProfile((prev) => ({
        ...prev,
        ...formData,
      }));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({
        fullName: profile.fullName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
      });
    }
    setIsEditing(!isEditing);
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle}>My Profile</h1>
          <button
            className={styles.topEditButton}
            onClick={handleEditToggle}
            aria-label="Edit profile"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        <div className={styles.profileHeader}>
          <div className={styles.profileCard}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>{getInitials(profile.fullName)}</div>
              <div className={styles.userInfo}>
                <h1 className={styles.userName}>{profile.fullName}</h1>
                <p className={styles.userId}>{profile.userId}</p>
                <p className={styles.userRole}>
                  {profile.role} - {profile.location}
                </p>
                <div className={styles.tags}>
                  {profile.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.leftColumn}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Personal Information</h2>

              <div className={styles.formGroup}>
                <label htmlFor="fullName" className={styles.label}>
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className={styles.input}
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={styles.input}
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phoneNumber" className={styles.label}>
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  className={styles.input}
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.saveButton}
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={handleEditToggle}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Learning Summary</h2>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryValue}>{profile.courses}</div>
                  <div className={styles.summaryLabel}>Courses</div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryValue}>{profile.avgProgress}%</div>
                  <div className={styles.summaryLabel}>Avg Progress</div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryValue}>{profile.certificates}</div>
                  <div className={styles.summaryLabel}>Certificates</div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryValue}>{profile.avgScore}</div>
                  <div className={styles.summaryLabel}>Avg Score</div>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Achievements</h2>
              <div className={styles.achievementsList}>
                {profile.achievements.map((achievement) => (
                  <div key={achievement.id} className={styles.achievementItem}>
                    <span
                      className={styles.achievementIcon}
                      role="img"
                      aria-label={achievement.title}
                    >
                      {achievement.icon}
                    </span>
                    <div className={styles.achievementContent}>
                      <div className={styles.achievementTitle}>
                        {achievement.title}
                      </div>
                      <div className={styles.achievementDesc}>
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
