import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

export type AuthRequest = Request & {
  user?: {
    userId: string;
    email: string;
    role: string;
    ownerId?: string;
    targetUserId: string;
  };
};

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    // Check if user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({ error: 'User account has been deleted' });
    }

    // Check if user is suspended
    if ((user as any).is_suspended) {
      return res.status(403).json({ error: 'Your account has been suspended' });
    }

    decoded.role = decoded.role || 'ADMIN';
    req.user = decoded;
    req.user!.targetUserId = decoded.role === 'STAFF' ? decoded.ownerId : decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
