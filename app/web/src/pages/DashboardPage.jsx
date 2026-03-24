import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarPanel } from '../components/CalendarPanel.jsx';
import { DiaryEditor } from '../components/DiaryEditor.jsx';
import { ReminderSettings } from '../components/ReminderSettings.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useDiaryData } from '../hooks/useDiaryData.js';
import { formatLocalDate } from '../utils/date.js';

export function DashboardPage() {
  const today = formatLocalDate(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { entries, moods, tags, loading, syncSavedEntry } = useDiaryData();
  const selectedEntry = useMemo(() => entries.find((entry) => entry.id === selectedEntryId) || null, [entries, selectedEntryId]);
  const activeSection = location.hash.replace('#', '');
  const showWelcome = !activeSection;

  function openTrackedEntry(entry) {
    setSelectedDate(entry.entryDate);
    setSelectedEntryId(entry.id);
    navigate('/dashboard#journal-entry');
  }

  function handleSelectDate(date) {
    setSelectedDate(date);
    setSelectedEntryId(null);
  }

  if (loading) {
    return <p>Loading your workspace...</p>;
  }

  return (
    <div className="page-stack">
      <div className="dashboard-column">
        {showWelcome && (
          <article className="metric-card" id="welcome-back">
            <p className="eyebrow">Welcome back</p>
            <h3>{user?.fullName}</h3>
            <p>Keep your private writing habit consistent and measurable.</p>
          </article>
        )}
        {activeSection === 'entries-tracked' && (
          <article className="metric-card" id="entries-tracked">
            <p className="eyebrow">Entries tracked</p>
            <h3>{entries.length}</h3>
            {entries.length ? (
              <div className="entry-list">
                {entries.map((entry) => (
                  <button key={entry.id} type="button" className="entry-list__item" onClick={() => openTrackedEntry(entry)}>
                    <strong>{entry.title || 'Untitled entry'}</strong>
                    <span>{entry.entryDate}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p>Start with your first entry today.</p>
            )}
          </article>
        )}
        {activeSection === 'tags-in-use' && (
          <article className="metric-card" id="tags-in-use">
            <p className="eyebrow">Tags in use</p>
            <h3>{tags.length}</h3>
            {tags.length ? (
              <div className="entry-list">
                {tags.map((tag) => (
                  <div key={tag.id} className="entry-list__item">
                    <strong>#{tag.name}</strong>
                    <span>{tag.usageCount} {tag.usageCount === 1 ? 'entry' : 'entries'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>Add tags to build topic-based reflection.</p>
            )}
          </article>
        )}
        {activeSection === 'calendar' && (
          <div id="calendar">
            <CalendarPanel selectedDate={selectedDate} entries={entries} onSelectDate={handleSelectDate} />
          </div>
        )}
        {activeSection === 'journal-entry' && (
          <div id="journal-entry">
            <DiaryEditor selectedDate={selectedDate} entry={selectedEntry} moods={moods} onSaved={syncSavedEntry} />
          </div>
        )}
        {activeSection === 'reminders' && (
          <div id="reminders">
            <ReminderSettings user={user} />
          </div>
        )}
      </div>
    </div>
  );
}
