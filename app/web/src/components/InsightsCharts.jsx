import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function InsightsCharts({ moodStats, tagStats, streak }) {
  const moodData = {
    labels: moodStats.map((item) => `${item.emoji} ${item.mood}`),
    datasets: [
      {
        data: moodStats.map((item) => item.total),
        backgroundColor: ['#ffb703', '#8ecae6', '#219ebc', '#6d597a', '#577590']
      }
    ]
  };

  const tagData = {
    labels: tagStats.map((item) => `#${item.tag}`),
    datasets: [
      {
        label: 'Tag usage',
        data: tagStats.map((item) => item.usageCount),
        backgroundColor: '#d97706'
      }
    ]
  };

  return (
    <div className="insights-grid">
      <article className="panel">
        <p className="eyebrow">Writing streak</p>
        <h2>{streak.currentStreak} days</h2>
        <p>Longest streak: {streak.longestStreak} days</p>
      </article>
      <article className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Mood balance</p>
            <h2>Emotional trend</h2>
          </div>
        </div>
        <Doughnut data={moodData} />
      </article>
      <article className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Topic patterns</p>
            <h2>Most used tags</h2>
          </div>
        </div>
        <Bar data={tagData} options={{ plugins: { legend: { display: false } } }} />
      </article>
    </div>
  );
}
