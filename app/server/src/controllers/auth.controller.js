import { getCurrentUser, loginUser, registerUser } from '../services/auth.service.js';

export async function register(req, res, next) {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await getCurrentUser(req.user.sub);
    res.json({ user });
  } catch (error) {
    next(error);
  }
}
