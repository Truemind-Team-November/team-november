import styles from './progress.module.css';

type ProgressCard = {
  title: string;
  value: number;
  ringClass: string;
  valueClass: string;
};

type SkillItem = {
  name: string;
  value: number;
  fillClass: string;
};

type ActivityItem = {
  title: string;
  subtitle: string;
  score: number;
  colorClass: string;
};

const progressCards: ProgressCard[] = [
  {
    title: 'UI/UX Fundamentals',
    value: 72,
    ringClass: 'ringTeal',
    valueClass: 'valueTeal',
  },
  {
    title: 'Product Thinking',
    value: 45,
    ringClass: 'ringBlue',
    valueClass: 'valueBlue',
  },
  {
    title: 'Agile & Scrum',
    value: 12,
    ringClass: 'ringPurple',
    valueClass: 'valuePurple',
  },
  {
    title: 'Overall Progress',
    value: 70,
    ringClass: 'ringOrange',
    valueClass: 'valueOrange',
  },
];

const skills: SkillItem[] = [
  { name: 'Visual Design', value: 82, fillClass: 'fill82' },
  { name: 'User Research', value: 68, fillClass: 'fill68' },
  { name: 'Prototyping', value: 55, fillClass: 'fill55' },
  { name: 'Collaboration', value: 90, fillClass: 'fill90' },
  { name: 'Communication', value: 75, fillClass: 'fill75' },
];

const activities: ActivityItem[] = [
  {
    title: 'Sprint Retrospective',
    subtitle: 'Agile & scrum \u2018Mar 15',
    score: 88,
    colorClass: 'scoreBlue',
  },
  {
    title: 'User Research Report',
    subtitle: 'Product Thinking \u2018Mar 10',
    score: 92,
    colorClass: 'scoreGreen',
  },
  {
    title: 'Color Palette Project',
    subtitle: 'UI/UX Fundamentals \u2018Mar 5',
    score: 79,
    colorClass: 'scorePurple',
  },
];

export default function ProgressPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Progress</h1>
      </header>

      <section className={styles.progressGrid}>
        {progressCards.map((card) => (
          <article key={card.title} className={styles.progressCard}>
            <div className={`${styles.progressRing} ${styles[card.ringClass]}`}>
              <div className={styles.progressCenter}>
                <span className={styles[card.valueClass]}>{card.value}%</span>
              </div>
            </div>
            <p className={styles.cardLabel}>{card.title}</p>
            <span className={styles.cardGlow} />
          </article>
        ))}
      </section>

      <section className={styles.bottomGrid}>
        <article className={styles.skillsPanel}>
          <h2 className={styles.panelTitle}>Skill Breakdown</h2>
          <div className={styles.skillList}>
            {skills.map((skill) => (
              <div key={skill.name} className={styles.skillRow}>
                <p className={styles.skillName}>{skill.name}</p>
                <div className={styles.skillTrack}>
                  <div className={`${styles.skillFill} ${styles[skill.fillClass]}`} aria-hidden="true" />
                </div>
                <p className={styles.skillPercent}>{skill.value}%</p>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.activityPanel}>
          <h2 className={styles.srOnly}>Recent Scores</h2>
          <div className={styles.activityList}>
            {activities.map((activity) => (
              <div key={activity.title} className={styles.activityItem}>
                <div>
                  <p className={styles.activityTitle}>{activity.title}</p>
                  <p className={styles.activitySub}>{activity.subtitle}</p>
                </div>
                <p className={`${styles.activityScore} ${styles[activity.colorClass]}`}>
                  {activity.score}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
