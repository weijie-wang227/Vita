import { Request, Response } from 'express'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models'

interface RegisterBody {
  email: string
  password: string
  name: string
}

interface LoginBody {
  email: string
  password: string
}

import { Router } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { getJwtSecret } from '../services/helper'
const authRouter = Router()

// Register
authRouter.post('/register', async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  try {
    const { email, password, name } = req.body

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10)

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name,
    })

    await user.save()

    // Generate token
    const token = jwt.sign({ userId: user._id, email: user.email }, getJwtSecret(), {
      expiresIn: '7d',
    })

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Login
authRouter.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user
    const user = await User.findOne({ email }).populate('membershipPlanId')
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Generate token
    const token = jwt.sign({ userId: user._id, email: user.email }, getJwtSecret(), {
      expiresIn: '7d',
    })

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        currentPlan: user.membershipPlanId,
        creditsRemaining: user.credits
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Get current user (protected route example)
authRouter.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password').populate("membershipPlanId");

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current user' })
  }
})

export default authRouter
