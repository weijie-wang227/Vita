import mongoose from 'mongoose'
import { Router } from 'express'
import { Post, Comment } from '../models/Feed'
import { authenticateToken, type AuthRequest } from '../middleware/auth'
import { getFriendIdsForUser } from '../services/helper'

const feedRouter = Router()

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id)
}

// GET /api/feed
// Get posts from current user + friends
feedRouter.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    if (!isValidId(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }

    const friendIds = await getFriendIdsForUser(userId)

    const visibleUserIds = [userId, ...friendIds]

    const posts = await Post.find({
      userId: { $in: visibleUserIds },
    })
      .sort({ createdAt: -1 })
      .populate('userId', 'name avatarUrl bio')
      .populate('classId', 'title imageUrl date time location instructor')

    res.json(posts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch feed' })
  }
})

// POST /api/feed/post
// Create a new post
feedRouter.post('/post', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const { imageUrl, title, description, classId } = req.body

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    if (!isValidId(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }

    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'description is required' })
    }

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required' })
    }

    if (classId && !isValidId(classId)) {
      return res.status(400).json({ error: 'Invalid class ID' })
    }

    const post = await Post.create({
      userId,
      imageUrl,
      description,
      title,
      classId: classId || undefined,
    })

    const populatedPost = await Post.findById(post._id)
      .populate('userId', 'name avatarUrl bio')
      .populate('classId', 'title imageUrl date time location instructor')

    res.status(201).json(populatedPost)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create post' })
  }
})

// GET /api/feed/comments/:id
// Get comments for one post
feedRouter.get('/comments/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const postId = req.params.id

    if (!postId || Array.isArray(postId) || !isValidId(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' })
    }

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const comments = await Comment.find({
      postId,
    })
      .sort({ createdAt: 1 })
      .populate('userId', 'name avatarUrl bio')

    res.json(comments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch comments' })
  }
})

// POST /api/feed/comment/:id
// Add comment to one post
feedRouter.post('/comment/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const postId = req.params.id
    const { content } = req.body

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    if (!isValidId(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }

    if (!postId || Array.isArray(postId) || !isValidId(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' })
    }

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Comment content is required' })
    }

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const comment = await Comment.create({
      userId,
      postId,
      content,
    })

    const populatedComment = await Comment.findById(comment._id).populate(
      'userId',
      'name avatarUrl bio',
    )

    res.status(201).json(populatedComment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create comment' })
  }
})

export default feedRouter;