import { Router } from 'express'
import { Group } from '../models/Group'
import { Joins } from '../models/Joins'
import { GroupChat } from '../models/GroupChat'
import { authenticateToken, optionalAuthenticateToken, type AuthRequest } from '../middleware/auth'
import { getFriendIdsForUser, buildGroupInfo } from '../services/helper'
import { isValidId } from '../services/helper'

const groupRouter = Router()

// GET /api/groups
groupRouter.get("/", optionalAuthenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    const groups = await Group.find().sort({ date: 1, time: 1 }).populate('admin', 'name avatarUrl bio')

    // Guest user: return normal group data only
    if (!userId) {
      return res.status(200).json(groups);
    }

    // Logged-in user: return groups with user context
    const friendIds = await getFriendIdsForUser(userId);

    const groupsWithUserContext = await Promise.all(
      groups.map((groupItem) => buildGroupInfo(groupItem, userId, friendIds)),
    );

    return res.status(200).json(groupsWithUserContext);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch groups" });
  }
});

// GET /api/groups/:id
groupRouter.get("/:id", optionalAuthenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const groupId = req.params.id;

    const groupItem = await Group.findById(groupId).populate('admin', 'name avatarUrl bio');

    if (!groupItem) {
      return res.status(404).json({ error: "group not found" });
    }

    // Guest user: return group without personalised info
    if (!userId) {
      return res.status(200).json(groupItem);
    }

    // Logged-in user: return group with personalised info
    const friendIds = await getFriendIdsForUser(userId);

    const groupInfo = await buildGroupInfo(groupItem, userId, friendIds);

    return res.status(200).json(groupInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch group" });
  }
});

groupRouter.post('/create', authenticateToken, async (req: AuthRequest, res) => {
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
      return res.status(400).json({ error: 'Description is required' })
    }

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required' })
    }

    if (classId && !isValidId(classId)) {
      return res.status(400).json({ error: 'Invalid class ID' })
    }

    const group = await Group.create({
      admin: userId,
      imageUrl,
      description,
      title,
    })

    const populatedPost = await Group.findById(group._id)
      .populate('admin', 'name avatarUrl bio')
      .populate('classId', 'title imageUrl date time location instructor')

    res.status(201).json(populatedPost)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create post' })
  }
})

// POST /api/groups/:id/book
groupRouter.post('/:id/join', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const groupId = req.params.id

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    if (!groupId || Array.isArray(groupId)) {
      return res.status(400).json({ error: 'Invalid group ID' })
    }

    const groupItem = await Group.findById(groupId)

    if (!groupItem) {
      return res.status(404).json({ error: 'group not found' })
    }

    const existingJoin = await Joins.findOne({
      userId,
      groupId,
    })

    if (existingJoin) {
      return res.status(409).json({ error: 'You have already booked this group' })
    }

    const Join = await Joins.create({
      userId,
      groupId,
    })

    await Group.findByIdAndUpdate(groupId, {
      $inc: { registered: 1 },
    })

    res.status(201).json(Join)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to book group' })
  }
})

// DELETE /api/groups/:id/cancel
groupRouter.delete('/:id/cancel', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const groupId = req.params.id

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    if (!groupId || Array.isArray(groupId)) {
      return res.status(400).json({ error: 'Invalid group ID' })
    }

    const Join = await Joins.findOneAndDelete({
      userId,
      groupId,
    })

    if (!Join) {
      return res.status(404).json({ error: 'Join not found' })
    }

    await Group.findByIdAndUpdate(groupId, {
      $inc: { registered: -1 },
    })

    res.json({ message: 'group booking cancelled successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to cancel group booking' })
  }
})

groupRouter.post("/:id/message", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const groupId = req.params.id;
    const { message } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const groupInfo = await Group.findById(groupId);

    if (!groupInfo) {
      return res.status(404).json({ error: "group not found" });
    }

    const Join = await Joins.findOne({
      userId,
      groupId,
    });

    if (!Join) {
      return res.status(403).json({
        error: "Only registered members can send messages",
      });
    }

    const newChat = await GroupChat.create({
      userId,
      groupId: groupInfo._id,
      message: message.trim(),
    });

    const populatedChat = await newChat.populate("userId", "name");

    return res.status(201).json({
      id: populatedChat._id.toString(),
      userName: (populatedChat.userId as any)?.name ?? "Unknown user",
      message: populatedChat.message,
      createdAt: populatedChat.createdAt.toISOString(),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to send chat message" });
  }
});

groupRouter.get("/:id/chat", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const groupId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const groupInfo = await Group.findById(groupId);

    if (!groupInfo) {
      return res.status(404).json({ error: "group not found" });
    }

    const Join = await Joins.findOne({
      userId,
      groupId,
    });

    if (!Join) {
      return res.status(403).json({
        error: "Only registered members can view this chat",
      });
    }

    const messages = await GroupChat.find({ groupId })
      .populate("userId", "name")
      .sort({ createdAt: 1 });
      
    console.log(messages)

    const formattedMessages = messages.map((chat: any) => ({
      id: chat._id.toString(),
      userName: chat.userId?.name ?? "Unknown user",
      message: chat.message,
      createdAt: chat.createdAt.toISOString(),
    }));

    return res.status(200).json(formattedMessages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch chat messages" });
  }
});

export default groupRouter