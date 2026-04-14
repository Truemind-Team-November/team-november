'use client';

import React, { useEffect, useState } from 'react';
import client from '@/lib/client';
import { useRouter } from 'next/navigation';

const defaultProfile = {
  fullName: 'User',
  email: '',
  location: '',
  userId: 'TMI-XXXX',
  role: 'Member',
  userRole: 'Student', 
  tags: ['Learner'],
  courses: 0,
  avgProgress: 0,
  certificates: 0,
  avgScore: 0,
  achievements: [],
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    location: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const hydrateProfile = async () => {
      try {
        const response = await client.get('/Profile/me');
        const payload = response.data?.data;
        console.log(payload);        

        if (!payload) return;

        const personal = payload.personalInformation || {};
        const summary = payload.learningSummary || {};
        const rawRole = payload.role || 'Student';
        const isInstructor = rawRole === "Instructor";

        // Logic to remove "Intern" related text from headline for Instructors
        let displayHeadline = payload.headline || personal.discipline || '';
        if (isInstructor && displayHeadline.toLowerCase().includes('intern')) {
          displayHeadline = displayHeadline
            .split('-')
            .filter(part => !part.toLowerCase().includes('intern'))
            .join('-')
            .replace(/^[\s-]+|[\s-]+$/g, '') // Clean up leading/trailing dashes/spaces
            .trim();
        }

        const nextProfile = {
          fullName: payload.fullName || defaultProfile.fullName,
          email: personal.email || defaultProfile.email,
          location: personal.city ? `${personal.city}, ${personal.country}` : 'Abuja, Nigeria',
          userId: payload.publicId || defaultProfile.userId,
          role: displayHeadline,
          userRole: rawRole, 
          tags: Array.isArray(payload.badges) ? payload.badges.map(b => b.label) : [],
          courses: summary.courses || 0,
          avgProgress: Math.round(summary.averageProgress || 0),
          certificates: summary.certificatesEarned || 0,
          avgScore: Number(summary.averageScore || 0),
          achievements: Array.isArray(payload.achievements) ? payload.achievements : [],
        };

        setProfile(nextProfile);
        setFormData({
          fullName: nextProfile.fullName,
          email: nextProfile.email,
          location: nextProfile.location,
        });
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    hydrateProfile();
  }, []);

  const confirmLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const [firstName, ...rest] = formData.fullName.split(' ');
      const lastName = rest.join(' ');

      await client.put('/Profile/me', {
        firstName,
        lastName,
        location: formData.location,
      });

      setProfile(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#101723]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0950C3] border-t-transparent"></div>
      </div>
    );
  }

  const isInstructor = profile.userRole === "Instructor";

  return (
    <div className="relative min-h-screen w-full bg-[#101723] text-[#FAFCFF]">
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl border border-[#D6E3F5]/20 bg-[#101723] p-6 text-center shadow-2xl">
            <h3 className="mb-2 text-xl font-bold text-white">Confirm Logout</h3>
            <p className="mb-6 text-sm text-[#ADC7EB]">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl border border-[#D6E3F5]/30 py-2.5 text-sm font-bold transition hover:bg-[#D6E3F5]/10"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-screen-2xl px-5 pb-8 pt-6 lg:px-10">
        <div className="mb-8 flex items-center justify-between border-b border-[#4B4C4E] pb-4">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <div className="flex gap-3">
            <button
              className="rounded-xl border border-[#D6E3F5]/30 px-5 py-2 text-sm font-bold text-[#0950C3] transition hover:bg-[#D6E3F5]/10"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button
              className="rounded-xl bg-red-500/10 border border-red-500/30 px-5 py-2 text-sm font-bold text-red-500 transition hover:bg-red-500/20"
              onClick={() => setShowLogoutModal(true)}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Profile Banner */}
        <div className="mb-8">
          <div className="rounded-2xl border border-[#D6E3F5]/20 bg-[#101723] p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-[#0950C3] text-3xl font-bold text-white shadow-lg">
                {getInitials(profile.fullName)}
              </div>
              <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold leading-tight">{profile.fullName}</h1>
                    {/* ALWAYS DISPLAY THE USER ROLE HERE */}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                        isInstructor ? "bg-blue-500/10 text-blue-400 border-blue-500/30" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}>
                        {profile.userRole}
                    </span>
                </div>
                <p className="text-xl font-medium text-[#0950C3]">{profile.userId}</p>
                <p className="text-lg text-[#D6E3F5]">
                  {profile.role} {profile.role && '•'} <span className="opacity-70">{profile.location}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.tags.map((tag, i) => (
                    <span key={i} className="rounded-lg bg-[#CEE0FD] px-3 py-1 text-xs font-bold text-[#0950C3]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[550px_minmax(0,1fr)]">
          {/* Personal Info Form */}
          <div className="rounded-2xl border border-[#D6E3F5]/20 bg-[#101723] p-6 h-fit">
            <h2 className="mb-5 text-2xl font-bold">Personal Information</h2>
            <div className="space-y-4">
              {[
                { label: 'Full Name', field: 'fullName' },
                { label: 'Email Address', field: 'email', type: 'email' },
                { label: 'Location / City', field: 'location' }
              ].map((item) => (
                <div key={item.field}>
                  <label className="mb-1 block text-xs font-bold text-[#D6E3F5] uppercase tracking-wider">
                    {item.label}
                  </label>
                  <input
                    name={item.field}
                    type={item.type || 'text'}
                    className="h-10 w-full rounded-lg border border-[#D6E3F5]/30 bg-transparent px-4 text-sm text-white outline-none focus:border-[#0950C3] disabled:opacity-50 transition-colors"
                    value={formData[item.field]}
                    onChange={(e) => setFormData({ ...formData, [item.field]: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="mt-4 w-full rounded-lg bg-[#0950C3] py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:bg-slate-700 transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Learning/Teaching Summary */}
            <div className="rounded-2xl border border-[#D6E3F5]/20 bg-[#101723] p-6">
              <h2 className="mb-4 text-2xl font-bold">
                {isInstructor ? 'Teaching Summary' : 'Learning Summary'}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: isInstructor ? 'Assigned Courses' : 'Courses', val: profile.courses, color: 'text-[#09C398]' },
                  { label: isInstructor ? 'Student Avg Progress' : 'Avg Progress', val: `${profile.avgProgress}%`, color: 'text-[#0950C3]' },
                  { label: isInstructor ? 'Published Lessons' : 'Certificates', val: profile.certificates, color: 'text-[#DE55F3]' },
                  { label: isInstructor ? 'Avg Rating' : 'Avg Score', val: profile.avgScore, color: 'text-[#EF9B15]' },
                ].map((stat, i) => (
                  <div key={i} className="rounded-xl border border-[#D6E3F5]/10 p-5 text-center bg-[#161f2c]">
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.val}</div>
                    <div className="text-sm text-[#D6E3F5] opacity-80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements - Only show for Students */}
            {!isInstructor && (
              <div className="rounded-2xl border border-[#D6E3F5]/20 bg-[#101723] p-6">
                <h2 className="mb-4 text-2xl font-bold">Achievements</h2>
                <div className="space-y-3">
                  {profile.achievements.length > 0 ? (
                    profile.achievements.map((ach, index) => (
                      <div key={index} className="flex items-center gap-4 rounded-xl border border-[#D6E3F5]/10 bg-[#161f2c] px-4 py-4 hover:border-blue-500/50 transition-all">
                        <span className="text-2xl">{ach.icon || '🏆'}</span>
                        <div>
                          <div className="text-lg font-bold leading-tight">{ach.title}</div>
                          <div className="text-sm text-[#ADC7EB]">{ach.description}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#ADC7EB] italic">No achievements unlocked yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}