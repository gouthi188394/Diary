import { deleteEntry, listEntries, listMoods, listTags, updateEntry, upsertEntry } from '../services/entry.service.js';

export async function getEntries(req, res, next) {
  try {
    const entries = await listEntries(req.user.sub, req.query);
    res.json({ entries });
  } catch (error) {
    next(error);
  }
}

export async function saveEntry(req, res, next) {
  try {
    const entry = await upsertEntry(req.user.sub, req.body);
    res.status(201).json({ entry });
  } catch (error) {
    next(error);
  }
}

export async function removeEntry(req, res, next) {
  try {
    await deleteEntry(req.user.sub, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function replaceEntry(req, res, next) {
  try {
    const entry = await updateEntry(req.user.sub, req.params.id, req.body);
    res.json({ entry });
  } catch (error) {
    next(error);
  }
}

export async function getTags(req, res, next) {
  try {
    const tags = await listTags(req.user.sub);
    res.json({ tags });
  } catch (error) {
    next(error);
  }
}

export async function getMoods(_req, res, next) {
  try {
    const moods = await listMoods();
    res.json({ moods });
  } catch (error) {
    next(error);
  }
}
