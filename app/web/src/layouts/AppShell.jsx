import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function AppShell() {
  const { logout, user } = useAuth();
  const location = useLocation();

  function openDashboard() {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function getSectionClass(hash) {
    return location.pathname === '/dashboard' && location.hash === hash ? 'active' : '';
  }

  function getDashboardClass({ isActive }) {
    return isActive && location.hash === '' ? 'active' : '';
  }

  return (
    <div className="shell">
      <aside className="shell__sidebar">
        <div>
          <p className="eyebrow">Private journal SaaS</p>
          <h1>Diary Flow</h1>
          <p className="shell__intro">Daily writing, mood awareness, tag patterns, and habit insights in one secure workspace.</p>
        </div>
        <nav className="shell__nav">
          <NavLink to="/dashboard" end onClick={openDashboard} className={getDashboardClass}>
            Dashboard
          </NavLink>
          <NavLink to="/dashboard/insights">Insights</NavLink>
          <Link to="/dashboard#entries-tracked" className={getSectionClass('#entries-tracked')}>
            Entries tracked
          </Link>
          <Link to="/dashboard#tags-in-use" className={getSectionClass('#tags-in-use')}>
            Tags in use
          </Link>
          <Link to="/dashboard#calendar" className={getSectionClass('#calendar')}>
            Calendar
          </Link>
          <Link to="/dashboard#journal-entry" className={getSectionClass('#journal-entry')}>
            Journal entry
          </Link>
          <Link to="/dashboard#reminders" className={getSectionClass('#reminders')}>
            Reminders
          </Link>
        </nav>
        <div className="shell__profile">
          <strong>{user?.fullName}</strong>
          <span>{user?.email}</span>
          <button type="button" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="shell__content">
        <Outlet />
      </main>
    </div>
  );
}
