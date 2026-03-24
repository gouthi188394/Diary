import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export function ReminderSettings({ user }) {
  const { token } = useAuth();
  const [enabled, setEnabled] = useState(Boolean(user?.reminderEnabled));
  const [time, setTime] = useState(user?.reminderTime || '20:00');
  const [status, setStatus] = useState('');

  useEffect(() => {
    setEnabled(Boolean(user?.reminderEnabled));
    setTime(user?.reminderTime || '20:00');
  }, [user]);

  async function save() {
    await api.put(
      '/reminders',
      {
        reminderEnabled: enabled,
        reminderTime: enabled ? time : null
      },
      token
    );
    setStatus('Saved');
  }

  async function enableBrowserNotifications() {
    if (!('Notification' in window)) {
      setStatus('Browser notifications are not supported here');
      return;
    }

    const permission = await Notification.requestPermission();
    setStatus(permission === 'granted' ? 'Browser notifications enabled' : 'Permission denied');
  }

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Reminders</p>
          <h2>Keep the streak alive</h2>
        </div>
      </div>
      <label className="checkbox">
        <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
        Daily reminder
      </label>
      <label>
        Reminder time
        <input type="time" value={time} onChange={(event) => setTime(event.target.value)} disabled={!enabled} />
      </label>
      <div className="button-row">
        <button type="button" className="primary-button" onClick={save}>
          Save reminder
        </button>
        <button type="button" className="secondary-button" onClick={enableBrowserNotifications}>
          Enable browser alerts
        </button>
      </div>
      {status ? <p className="helper-text">{status}</p> : null}
    </section>
  );
}
