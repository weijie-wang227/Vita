import { Router } from 'express'
import { Class, type IClass } from '../models/Class'
import { Signups } from '../models/Signups'
import { Friends } from '../models/Friends'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { getFriendIdsForUser, buildClassInfo } from '../services/helper'

const classRouter = Router()

// GET /api/classes
classRouter.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const classes = await Class.find().sort({ date: 1, time: 1 })

    const friendIds = await getFriendIdsForUser(userId)

    const classesWithUserContext = await Promise.all(
      classes.map((classItem) => buildClassInfo(classItem, userId, friendIds)),
    )

    res.json(classesWithUserContext)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch classes' })
  }
})

// GET /api/classes/:id
classRouter.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const classId = req.params.id

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const classItem = await Class.findById(classId)

    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' })
    }

    const friendIds = await getFriendIdsForUser(userId)

    const classInfo = await buildClassInfo(classItem, userId, friendIds)

    res.json(classInfo)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch class' })
  }
})

// POST /api/classes/:id/book
classRouter.post('/:id/book', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const classId = req.params.id

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const classItem = await Class.findById(classId)

    if (!classItem) {
      return res.status(404).json({ error: 'Class not found' })
    }

    const existingSignup = await Signups.findOne({
      userId,
      classId,
    })

    if (existingSignup) {
      return res.status(409).json({ error: 'You have already booked this class' })
    }

    const bookedCount = await Signups.countDocuments({
      classId,
    })

    if (bookedCount >= classItem.capacity) {
      return res.status(400).json({ error: 'Class is full' })
    }

    if (!classId || Array.isArray(classId)) {
      return res.status(400).json({ error: "Invalid class ID" })
    }

    const signup = await Signups.create({
      userId,
      classId,
    })

    res.status(201).json(signup)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to book class' })
  }
})

// DELETE /api/classes/:id/cancel
classRouter.delete('/:id/cancel', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const classId = req.params.id

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const signup = await Signups.findOneAndDelete({
      userId,
      classId,
    })

    if (!signup) {
      return res.status(404).json({ error: 'Signup not found' })
    }

    res.json({ message: 'Class booking cancelled successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to cancel class booking' })
  }
})

export default classRouter