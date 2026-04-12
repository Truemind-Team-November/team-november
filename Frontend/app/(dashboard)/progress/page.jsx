"use client";

import { useEffect, useState } from 'react';
import client from '@/lib/client';
import Spinner from '@/components/Spinner';

export default function ProgressPage() {
  const [cards, setCards] = useState([]);
  const [skills, setSkills] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        const response = await client.get('/Progress/me');
        const payload = response.data?.data;

        if (!payload) {
          return;
        }

        const palette = ['#00D4AA', '#0950C3', '#8B61E8'];
        const courseCards = (payload.courseProgressCards || []).slice(0, 3).map((card, index) => ({
          title: card.courseTitle,
          value: Math.round(card.percentage || 0),
          color: palette[index % palette.length],
        }));

        const overall = {
          title: 'Overall Progress',
          value: Math.round(payload.overallProgressPercentage || 0),
          color: '#EF9807',
        };

        const finalCards = [...courseCards];
        if (payload.overallProgressPercentage !== undefined) {
          finalCards.push(overall);
        }
        setCards(finalCards.slice(0, 4));

        const apiSkills = (payload.skillBreakdown || []).map((item) => ({
          name: item.skill,
          value: Math.round(item.score || 0),
        }));
        setSkills(apiSkills);

        const apiActivities = (payload.gradedWork || []).slice(0, 4).map((item, index) => {
          const activityDate = item.activityDate ? new Date(item.activityDate) : null;
          const dateLabel = activityDate
            ? activityDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            : 'Recent';

          return {
            title: item.title,
            subtitle: `${item.courseTitle} - ${dateLabel}`,
            score: Number(item.score || 0),
            color: palette[index % palette.length],
          };
        });
        setActivities(apiActivities);
      } catch (err) {
        console.error('Progress fetch error:', err);
        setError('Unable to load progress right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  return (
    <div className="min-h-screen bg-[#101723] px-5 pb-8 text-[#FAFCFF] lg:px-9">
      <header className="flex h-26 items-center border-b border-[#4B4C4E] pl-2">
        <h1 className="text-[40px] font-bold leading-tight">My Progress</h1>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <Spinner message="Calculating your achievements..." />
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center">
           <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Sync Error</h2>
          <p className="text-zinc-500 max-w-md">{error}</p>
        </div>
      ) : (
        <>
          <section className="mt-10 grid gap-6 xl:grid-cols-4 md:grid-cols-2 grid-cols-1">
            {cards.map((card) => (
              <article
                key={card.title}
                className="relative flex min-h-52 flex-col items-center justify-center rounded-2xl border border-[#D6E3F5] bg-[#101723] px-4 py-8"
              >
                <div
                  className="grid h-24 w-24 place-items-center rounded-full"
                  style={{ background: `conic-gradient(${card.color} ${card.value}%, #4d4e50 ${card.value}% 100%)` }}
                >
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-[#101723] text-[23px] font-bold">
                    <span style={{ color: card.color }}>{card.value}%</span>
                  </div>
                </div>
                <p className="mt-3 text-center text-base text-[#D6E3F5]">{card.title}</p>
                <span className="absolute -right-5 -top-7 h-24 w-20 rounded-full bg-[#415C8B]/50" />
              </article>
            ))}
            
            {cards.length === 0 && (
              <div className="xl:col-span-4 md:col-span-2 py-8 text-center border border-dashed border-[#7D7F82]/30 rounded-2xl">
                <p className="text-zinc-500 italic">Start your first course to track progress here!</p>
              </div>
            )}
          </section>

          <section className="mt-16 grid gap-16 xl:grid-cols-2 grid-cols-1">
            <article className="rounded-xl border border-[#7D7F82] bg-[#101723] px-6 pb-8 pt-6">
              <h2 className="text-[33px] font-bold leading-tight">Skill Breakdown</h2>
              <div className="mt-7 space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name} className="grid items-center gap-4 lg:grid-cols-[180px_1fr_48px] grid-cols-1">
                    <p className="text-[23px] leading-tight text-[#D6E3F5]">{skill.name}</p>
                    <div className="h-3.5 overflow-hidden rounded-xl bg-[#7D7F82]/50">
                      <div
                        className="h-full rounded-xl bg-[linear-gradient(279.23deg,#ADC7EB_7.56%,#627185_156.44%)]"
                        style={{ width: `${Math.max(0, Math.min(100, skill.value))}%` }}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-base font-bold text-[#0950C3]">{skill.value}%</p>
                  </div>
                ))}
                
                {skills.length === 0 && (
                  <p className="text-zinc-500 italic text-center py-4">Skills will appear as you complete assignments.</p>
                )}
              </div>
            </article>

            <article className="rounded-xl border border-[#7D7F82] bg-[#101723] p-6">
              <h2 className="sr-only">Recent Scores</h2>
              <div className="space-y-7">
                {activities.map((activity) => (
                  <div
                    key={activity.title}
                    className="flex items-center justify-between rounded-[10px] bg-[#1A2234] px-7 py-2"
                  >
                    <div>
                      <p className="text-[23px] font-bold leading-tight">{activity.title}</p>
                      <p className="text-base font-bold text-[#CEE0FD]">{activity.subtitle}</p>
                    </div>
                    <p className="text-[23px] font-bold" style={{ color: activity.color }}>
                      {activity.score}
                    </p>
                  </div>
                ))}

                {activities.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-zinc-500 italic font-bold">No graded work yet.</p>
                  </div>
                )}
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  );
}
