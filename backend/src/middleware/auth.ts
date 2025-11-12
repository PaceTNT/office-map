import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const DISABLE_AUTH = process.env.DISABLE_AUTH === 'true';

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // In development mode with auth disabled, use mock user
  if (DISABLE_AUTH) {
    req.user = {
      id: 'dev-user-id',
      email: 'dev@example.com',
      role: 'ADMIN', // Give admin role in dev mode
    };
    return next();
  }

  // Check for JWT token in Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: 'USER' | 'ADMIN';
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

export const generateToken = (user: {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
};
