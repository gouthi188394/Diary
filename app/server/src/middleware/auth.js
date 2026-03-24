import { verifyToken } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';

export function authMiddleware(req, _res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return next(new AppError(401, 'Authentication required'));
  }

  try {
    const token = header.slice(7);
    req.user = verifyToken(token);
    return next();
  } catch {
    return next(new AppError(401, 'Invalid or expired token'));
  }
}
