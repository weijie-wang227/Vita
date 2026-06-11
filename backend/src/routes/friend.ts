import { Router } from 'express'
import { Friends } from '../models/Friends'
import { User } from '../models/User'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const friendRouter = Router()
friendRouter.get('/', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const friendships = await Friends.find({ userId: req.userId })
        .populate('friendId', 'name email bio avatarUrl')

        const friends = friendships.map((friendship) => friendship.friendId)

        res.json(friends)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch friends' })
    }
})

friendRouter.post('/add/:friendId', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.userId
        
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: 'Missing userId' })
        }

        const friendId = req.params.friendId
        if (!friendId || Array.isArray(friendId)) {
            return res.status(400).json({ error: 'Friend ID is required' })
        } else if (friendId == userId) {
            return res.status(400).json({ error: 'FriendId cannot be userId' })
        }

        const friendUser = await User.findById(friendId)
        if (!friendUser) {
            return res.status(404).json({ error: 'Friend user not found' })
        }

        await Friends.create({ userId: userId, friendId: friendId })
        res.json(friendUser)
    } catch (error) {
        res.status(500).json({ error: 'Failed to add friend' })
    }
})
export default friendRouter