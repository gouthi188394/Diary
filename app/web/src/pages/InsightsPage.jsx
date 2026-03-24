import { useEffect, useState } from 'react';
import { InsightsCharts } from '../components/InsightsCharts.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export function InsightsPage() {
  const { token } = useAuth();
  const [data, setData] = useState({
    streak: { currentStreak: 0, longestStreak: 0 },
    moods: [],
    tags: []
  });

  useEffect(() => {
    Promise.all([api.get('/insights/streak', token), api.get('/insights/moods', token), api.get('/insights/tags', token)]).then(
      ([streak, moods, tags]) => {
        setData({
          streak,
          moods: moods.moods,
          tags: tags.tags
        });
      }
    );
  }, [token]);

  return (
    <div className="page-stack">
      <header className="page-header">
        <p className="eyebrow">Analytics</p>
        <h1>Patterns worth noticing</h1>
        <p>Use mood history, tag frequency, and writing streaks to understand how your days cluster over time.</p>
      </header>
      <InsightsCharts moodStats={data.moods} tagStats={data.tags} streak={data.streak} />
    </div>
  );
}
