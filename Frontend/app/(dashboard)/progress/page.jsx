const progressCards = [
  {
    title: 'UI/UX Fundamentals',
    value: 72,
    ringClass: 'bg-[conic-gradient(#00d4aa_72%,#4d4e50_72%_100%)]',
    valueClass: 'text-[#00D4AA]',
  },
  {
    title: 'Product Thinking',
    value: 45,
    ringClass: 'bg-[conic-gradient(#0950c3_45%,#4d4e50_45%_100%)]',
    valueClass: 'text-[#0950C3]',
  },
  {
    title: 'Agile & Scrum',
    value: 12,
    ringClass: 'bg-[conic-gradient(#8b61e8_12%,#4d4e50_12%_100%)]',
    valueClass: 'text-[#8B61E8]',
  },
  {
    title: 'Overall Progress',
    value: 70,
    ringClass: 'bg-[conic-gradient(#ef9807_70%,#4d4e50_70%_100%)]',
    valueClass: 'text-[#EF9807]',
  },
];

const skills = [
  { name: 'Visual Design', value: 82, fillClass: 'w-[82%]' },
  { name: 'User Research', value: 68, fillClass: 'w-[68%]' },
  { name: 'Prototyping', value: 55, fillClass: 'w-[55%]' },
  { name: 'Collaboration', value: 90, fillClass: 'w-[90%]' },
  { name: 'Communication', value: 75, fillClass: 'w-[75%]' },
];

const activities = [
  {
    title: 'Sprint Retrospective',
    subtitle: 'Agile & scrum \u2018Mar 15',
    score: 88,
    colorClass: 'text-[#0950C3]',
  },
  {
    title: 'User Research Report',
    subtitle: 'Product Thinking \u2018Mar 10',
    score: 92,
    colorClass: 'text-[#00D4AA]',
  },
  {
    title: 'Color Palette Project',
    subtitle: 'UI/UX Fundamentals \u2018Mar 5',
    score: 79,
    colorClass: 'text-[#8B61E8]',
  },
];

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-[#101723] px-5 pb-8 text-[#FAFCFF] lg:px-9">
      <header className="flex h-26 items-center border-b border-[#4B4C4E] pl-2">
        <h1 className="text-[40px] font-bold leading-tight">My Progress</h1>
      </header>

      <section className="mt-10 grid gap-6 xl:grid-cols-4 md:grid-cols-2 grid-cols-1">
        {progressCards.map((card) => (
          <article
            key={card.title}
            className="relative flex min-h-52 flex-col items-center justify-center rounded-2xl border border-[#D6E3F5] bg-[#101723] px-4 py-8"
          >
            <div className={`grid h-24 w-24 place-items-center rounded-full ${card.ringClass}`}>
              <div className="grid h-20 w-20 place-items-center rounded-full bg-[#101723] text-[23px] font-bold">
                <span className={card.valueClass}>{card.value}%</span>
              </div>
            </div>
            <p className="mt-3 text-center text-base text-[#D6E3F5]">{card.title}</p>
            <span className="absolute -right-5 -top-7 h-24 w-20 rounded-full bg-[#415C8B]/50" />
          </article>
        ))}
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
                    className={`h-full rounded-xl bg-[linear-gradient(279.23deg,#ADC7EB_7.56%,#627185_156.44%)] ${skill.fillClass}`}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-base font-bold text-[#0950C3]">{skill.value}%</p>
              </div>
            ))}
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
                <p className={`text-[23px] font-bold ${activity.colorClass}`}>{activity.score}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
