import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function sortEntries(entries) {
  return [...entries].sort((left, right) => right.entryDate.localeCompare(left.entryDate));
}

export function useDiaryData() {
  const { token } = useAuth();
  const [entries, setEntries] = useState([]);
  const [moods, setMoods] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!token) {
      return;
    }
    setLoading(true);
    const [entriesResponse, moodsResponse, tagsResponse] = await Promise.all([
      api.get('/entries', token),
      api.get('/moods', token),
      api.get('/tags', token)
    ]);
    setEntries(entriesResponse.entries);
    setMoods(moodsResponse.moods);
    setTags(tagsResponse.tags);
    setLoading(false);
  }

  async function syncSavedEntry(entry) {
    if (entry) {
      setEntries((currentEntries) => {
        const nextEntries = currentEntries.filter((currentEntry) => currentEntry.id !== entry.id);
        nextEntries.unshift(entry);
        return sortEntries(nextEntries);
      });
    }

    if (!token) {
      return;
    }

    const tagsResponse = await api.get('/tags', token);
    setTags(tagsResponse.tags);
  }

  useEffect(() => {
    load();
  }, [token]);

  return { entries, moods, tags, loading, reload: load, syncSavedEntry };
}
