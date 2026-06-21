import { Router } from 'express'
import { authenticateToken, optionalAuthenticateToken, type AuthRequest } from '../middleware/auth'
import { getFriendIdsForUser, buildClassInfo } from '../services/helper'
import { Chat, Class, Signups } from '../models'

const classRouter = Router()

// GET /api/classes
classRouter.get("/", optionalAuthenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    const classes = await Class.find().sort({ date: 1, time: 1 });

    // Guest user: return normal class data only
    if (!userId) {
      return res.status(200).json(classes);
    }

    // Logged-in user: return classes with user context
    const friendIds = await getFriendIdsForUser(userId);

    const classesWithUserContext = await Promise.all(
      classes.map((classItem) => buildClassInfo(classItem, userId, friendIds)),
    );

    return res.status(200).json(classesWithUserContext);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch classes" });
  }
});

// GET /api/classes/:id
classRouter.get("/:id", optionalAuthenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const classId = req.params.id;

    const classItem = await Class.findById(classId);

    if (!classItem) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Guest user: return class without personalised info
    if (!userId) {
      return res.status(200).json(classItem);
    }

    // Logged-in user: return class with personalised info
    const friendIds = await getFriendIdsForUser(userId);

    const classInfo = await buildClassInfo(classItem, userId, friendIds);

    return res.status(200).json(classInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch class" });
  }
});

// POST /api/classes/:id/book
classRouter.post('/:id/book', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId
    const classId = req.params.id

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    if (!classId || Array.isArray(classId)) {
      return res.status(400).json({ error: 'Invalid class ID' })
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

    if (classItem.registered >= classItem.capacity) {
      return res.status(400).json({ error: 'Class is full' })
    }

    const signup = await Signups.create({
      userId,
      classId,
    })

    await Class.findByIdAndUpdate(classId, {
      $inc: { registered: 1 },
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

    if (!classId || Array.isArray(classId)) {
      return res.status(400).json({ error: 'Invalid class ID' })
    }

    const signup = await Signups.findOneAndDelete({
      userId,
      classId,
    })

    if (!signup) {
      return res.status(404).json({ error: 'Signup not found' })
    }

    await Class.findByIdAndUpdate(classId, {
      $inc: { registered: -1 },
    })

    res.json({ message: 'Class booking cancelled successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to cancel class booking' })
  }
})

classRouter.post("/:id/message", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const classId = req.params.id;
    const { message } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const classInfo = await Class.findById(classId);

    if (!classInfo) {
      return res.status(404).json({ error: "Class not found" });
    }

    const signup = await Signups.findOne({
      userId,
      classId,
    });

    if (!signup) {
      return res.status(403).json({
        error: "Only registered members can send messages",
      });
    }

    const newChat = await Chat.create({
      userId,
      classId: classInfo._id,
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

classRouter.get("/:id/chat", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const classId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const classInfo = await Class.findById(classId);

    if (!classInfo) {
      return res.status(404).json({ error: "Class not found" });
    }

    const signup = await Signups.findOne({
      userId,
      classId,
    });

    if (!signup) {
      return res.status(403).json({
        error: "Only registered members can view this chat",
      });
    }

    const messages = await Chat.find({ classId })
      .populate("userId", "name")
      .sort({ createdAt: 1 });

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

export default classRouter