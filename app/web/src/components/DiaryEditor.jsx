import { useEffect, useRef, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function getDraftStorageKey(selectedDate) {
  return `diary-draft:new:${selectedDate}`;
}

function getEntryDraftStorageKey(selectedDate, entryId) {
  return entryId ? `diary-draft:entry:${entryId}` : getDraftStorageKey(selectedDate);
}

function readDraft(selectedDate, entryId) {
  try {
    const stored = window.localStorage.getItem(getEntryDraftStorageKey(selectedDate, entryId));
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function writeDraft(selectedDate, entryId, draft) {
  try {
    window.localStorage.setItem(getEntryDraftStorageKey(selectedDate, entryId), JSON.stringify(draft));
  } catch {}
}

export function DiaryEditor({ selectedDate, entry, moods, onSaved }) {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [moodId, setMoodId] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [status, setStatus] = useState('');
  const hasUserEdited = useRef(false);
  const loadedEntryKey = useRef(null);

  useEffect(() => {
    const nextEntryKey = entry?.id || `draft:${selectedDate}`;
    if (loadedEntryKey.current === nextEntryKey) {
      return;
    }

    const savedDraft = readDraft(selectedDate, entry?.id);
    setTitle(savedDraft?.title ?? entry?.title ?? '');
    setContent(savedDraft?.content ?? entry?.content ?? '');
    setTags(savedDraft?.tags ?? entry?.tags ?? []);
    setMoodId(savedDraft?.moodId ?? (entry?.mood?.id ? String(entry.mood.id) : ''));
    setIsLocked(savedDraft?.isLocked ?? Boolean(entry?.isLocked));
    setStatus('');
    hasUserEdited.current = false;
    loadedEntryKey.current = nextEntryKey;
  }, [entry?.id, selectedDate]);

  useEffect(() => {
    writeDraft(selectedDate, entry?.id, {
      title,
      content,
      tags,
      moodId,
      isLocked
    });
  }, [title, content, tags, moodId, isLocked, selectedDate, entry?.id]);

  async function save() {
    setStatus('Saving...');
    const payload = {
      title,
      content,
      tags,
      moodId: moodId ? Number(moodId) : null,
      isLocked,
      entryDate: selectedDate
    };

    const response = entry?.id
      ? await api.put(`/entries/${entry.id}`, payload, token)
      : await api.post('/entries', payload, token);
    const savedEntry = response.entry;
    const nextTitle = savedEntry?.title ?? payload.title;
    const nextContent = savedEntry?.content ?? payload.content;
    const nextTags = savedEntry?.tags ?? payload.tags;
    const nextMoodId = savedEntry?.mood?.id ? String(savedEntry.mood.id) : '';
    const nextIsLocked = savedEntry?.isLocked ?? payload.isLocked;

    setTitle(nextTitle);
    setContent(nextContent);
    setTags(nextTags);
    setMoodId(nextMoodId);
    setIsLocked(nextIsLocked);
    loadedEntryKey.current = savedEntry?.id || `draft:${selectedDate}`;

    writeDraft(selectedDate, savedEntry?.id, {
      title: nextTitle,
      content: nextContent,
      tags: nextTags,
      moodId: nextMoodId,
      isLocked: nextIsLocked
    });
    hasUserEdited.current = false;
    setStatus('Saved');
    await onSaved?.(savedEntry);
  }

  useEffect(() => {
    if (!content.trim() || !hasUserEdited.current) {
      return;
    }

    const timer = setTimeout(() => {
      save().catch(() => setStatus('Autosave failed'));
    }, 1200);

    return () => clearTimeout(timer);
  }, [title, content, selectedDate, moodId, isLocked, tags]);

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Journal entry</p>
          <h2>{selectedDate}</h2>
        </div>
        <span className="status-pill">{status || 'Draft'}</span>
      </div>
      <label>
        Title
        <input
          value={title}
          onChange={(event) => {
            hasUserEdited.current = true;
            setTitle(event.target.value);
          }}
          placeholder="Capture the main theme of the day"
        />
      </label>
      <label>
        What happened today?
        <textarea
          rows="12"
          value={content}
          onChange={(event) => {
            hasUserEdited.current = true;
            setContent(event.target.value);
          }}
          placeholder="Write freely. The app will autosave your progress."
        />
      </label>
      <div className="editor-grid">
        <label>
          Mood
          <select
            value={moodId}
            onChange={(event) => {
              hasUserEdited.current = true;
              setMoodId(event.target.value);
            }}
          >
            <option value="">No mood selected</option>
            {moods.map((mood) => (
              <option key={mood.id} value={mood.id}>
                {mood.emoji} {mood.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tags
          <div className="tag-input">
            <input value={tagInput} onChange={(event) => setTagInput(event.target.value)} placeholder="Type tag and press add" />
            <button
              type="button"
              onClick={() => {
                const next = tagInput.trim().replace(/^#/, '').toLowerCase();
                if (!next || tags.includes(next)) {
                  return;
                }
                hasUserEdited.current = true;
                setTags([...tags, next]);
                setTagInput('');
              }}
            >
              Add
            </button>
          </div>
        </label>
      </div>
      <div className="tag-list">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="chip"
            onClick={() => {
              hasUserEdited.current = true;
              setTags(tags.filter((item) => item !== tag));
            }}
          >
            #{tag}
          </button>
        ))}
      </div>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={isLocked}
          onChange={(event) => {
            hasUserEdited.current = true;
            setIsLocked(event.target.checked);
          }}
        />
        Mark this entry as locked
      </label>
        <button type="button" className="primary-button" onClick={save} disabled={!content.trim()}>
        {entry?.id ? 'Update entry' : 'Save entry'}
      </button>
    </section>
  );
}
