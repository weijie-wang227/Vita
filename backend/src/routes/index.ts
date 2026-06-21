import { Router } from 'express'
export const router = Router()

router.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Vita backend' })
})

import authRoutes from './auth'
import planRoutes from './plans'
import friendRoutes from './friend'
import classRoutes from './classes'
import feedRoutes from './feed'
import uploadRoutes from './uploads'
import userRoutes from './user'
import groupRoutes from './groups'
import activityRoutes from './activity'

router.use('/auth', authRoutes)
router.use('/plans', planRoutes)
router.use('/friends', friendRoutes)
router.use('/classes', classRoutes)
router.use('/feed', feedRoutes)
router.use('/uploads', uploadRoutes)
router.use('/user', userRoutes)
router.use('/groups', groupRoutes)
router.use('/activity', activityRoutes)