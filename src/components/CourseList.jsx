import React from 'react';

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '24px',
    paddingBottom: '10px',
    borderBottom: '3px solid var(--primary)',
    display: 'inline-block',
  },
  weekSection: {
    marginBottom: '40px',
  },
  weekTitle: (index) => ({
    fontSize: '1.3rem',
    background: `linear-gradient(135deg, ${getWeekColor(index)}, ${getWeekColorDark(index)})`,
    color: 'white',
    padding: '12px 20px',
    borderRadius: '10px',
    marginBottom: '16px',
  }),
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
  },
  card: {
    background: 'var(--card-bg)',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  lessonBadge: (color) => ({
    background: color,
    color: 'white',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 600,
  }),
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginBottom: '10px',
  },
  tag: {
    background: '#f1f5f9',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
  },
  repo: {
    fontSize: '0.8rem',
    color: 'var(--primary)',
  },
};

const weekColors = [
  ['#3b82f6', '#1d4ed8'], // Week 1-2
  ['#10b981', '#059669'], // Week 3-4
  ['#f59e0b', '#d97706'], // Week 5-6
  ['#ec4899', '#db2777'], // Week 7-8
  ['#8b5cf6', '#7c3aed'], // Week 9-10
  ['#ef4444', '#dc2626'], // Week 11-12
];

function getWeekColor(index) {
  return weekColors[index]?.[0] || weekColors[0][0];
}

function getWeekColorDark(index) {
  return weekColors[index]?.[1] || weekColors[0][1];
}

function CourseList({ courses, onLessonSelect }) {
  const weeks = Object.keys(courses);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📚 24课完整课程大纲</h1>

      {weeks.map((week, weekIndex) => (
        <section key={week} style={styles.weekSection}>
          <h2 style={styles.weekTitle(weekIndex)}>📗 {week}</h2>
          <div style={styles.grid}>
            {courses[week].map((lesson) => (
              <div
                key={lesson.id}
                style={styles.card}
                onClick={() => onLessonSelect(lesson)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.lessonBadge(getWeekColor(weekIndex))}>{lesson.id}</span>
                  <strong>{lesson.title}</strong>
                </div>
                <div style={styles.tags}>
                  {lesson.tags.map((tag) => (
                    <span key={tag} style={styles.tag}>{tag}</span>
                  ))}
                </div>
                {lesson.stars && (
                  <div style={styles.repo}>
                    ⭐{lesson.stars} {lesson.repo}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default CourseList;