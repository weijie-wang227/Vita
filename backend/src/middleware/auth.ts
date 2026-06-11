// middleware/authenticateToken.ts
import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

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

    const decoded = jwt.verify(token, JWT_SECRET) as {
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