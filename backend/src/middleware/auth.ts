// middleware/authenticateToken.ts
import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { getJwtSecret } from '../services/helper'


export interface AuthRequest extends Request {
  userId?: string
  userEmail?: string
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }

    const decoded = jwt.verify(token, getJwtSecret()) as {
      userId: string
      email: string
    }

    req.userId = decoded.userId
    req.userEmail = decoded.email

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}

export function optionalAuthenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  // No token means guest user, continue normally
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as {
      userId: string;
    };

    req.userId = decoded.userId;
    return next();
  } catch (error) {
    // Invalid token can either be treated as guest...
    console.log(error)
    return next();

    // Or, stricter version:
    // return res.status(401).json({ error: "Invalid token" });
  }
}