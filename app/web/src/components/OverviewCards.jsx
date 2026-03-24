export function OverviewCards({ user, entries, tags }) {
  const latest = entries[0];

  return (
    <div className="overview-grid">
      <article className="metric-card">
        <p className="eyebrow">Welcome back</p>
        <h3>{user?.fullName}</h3>
        <p>Keep your private writing habit consistent and measurable.</p>
      </article>
      <article className="metric-card">
        <p className="eyebrow">Entries tracked</p>
        <h3>{entries.length}</h3>
        <p>{latest ? `Latest entry on ${latest.entryDate}` : 'Start with your first entry today.'}</p>
      </article>
      <article className="metric-card">
        <p className="eyebrow">Tags in use</p>
        <h3>{tags.length}</h3>
        <p>{tags.length ? `Top tag: #${tags[0].name}` : 'Add tags to build topic-based reflection.'}</p>
      </article>
    </div>
  );
}
