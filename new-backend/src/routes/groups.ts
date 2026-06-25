import { Router } from "express";
import { findAuthenticatedUser } from "../auth.js";
import {
  AdminModel,
  ActivityJoinModel,
  ActivityModel,
  ChatMessageModel,
  ChatModel,
} from "../models/MockupData.js";
import { serializeChat, serializeChatMessage } from "../serializers.js";

const router = Router();

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function formatPreviewTime(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

async function findMemberChat(groupId: number, userId: unknown) {
  return ChatModel.findOne({ mockId: groupId, members: userId }).populate(
    "members",
  );
}

async function findAdminUserIds(groupId: unknown) {
  const admins = await AdminModel.find({ group: groupId }).select("user");

  return new Set(
    admins.map((admin: Record<string, any>) =>
      String(admin.user?._id ?? admin.user),
    ),
  );
}

router.get("/", async (req, res, next) => {
  try {
    const user = await findAuthenticatedUser(req.headers.authorization);

    if (!user) {
      res.status(401).json({ message: "Not signed in." });
      return;
    }

    const groups = await ChatModel.find({ members: user._id })
      .populate("members")
      .sort({ updatedAt: -1, mockId: 1 });

    res.json(groups.map(serializeChat));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await findAuthenticatedUser(req.headers.authorization);

    if (!user) {
      res.status(401).json({ message: "Not signed in." });
      return;
    }

    const groupId = Number(req.params.id);
    const group = await findMemberChat(groupId, user._id);

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    res.json(serializeChat(group));
  } catch (error) {
    next(error);
  }
});

router.post("/:id/join", async (req, res, next) => {
  try {
    const user = await findAuthenticatedUser(req.headers.authorization);

    if (!user) {
      res.status(401).json({ message: "Not signed in." });
      return;
    }

    const groupId = Number(req.params.id);
    const group = await ChatModel.findOne({ mockId: groupId });

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    const updatedGroup = await ChatModel.findByIdAndUpdate(
      group._id,
      { $addToSet: { members: user._id } },
      { new: true },
    ).populate("members");

    if (!updatedGroup) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    const activity = await ActivityModel.findOne({ chat: group._id });

    if (activity) {
      await ActivityJoinModel.updateOne(
        { userId: user._id, activityId: activity._id },
        { $setOnInsert: { userId: user._id, activityId: activity._id } },
        { upsert: true },
      );
    }

    res.json({ group: serializeChat(updatedGroup) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/messages", async (req, res, next) => {
  try {
    const user = await findAuthenticatedUser(req.headers.authorization);

    if (!user) {
      res.status(401).json({ message: "Not signed in." });
      return;
    }

    const groupId = Number(req.params.id);
    const group = await findMemberChat(groupId, user._id);

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    const messages = await ChatMessageModel.find({ chat: group._id })
      .populate("chat")
      .populate("sender")
      .sort({ createdAt: 1, _id: 1 })
      .limit(200);
    const adminUserIds = await findAdminUserIds(group._id);

    res.json(
      messages.map((message) => serializeChatMessage(message, adminUserIds)),
    );
  } catch (error) {
    next(error);
  }
});

router.post("/:id/messages", async (req, res, next) => {
  try {
    const user = await findAuthenticatedUser(req.headers.authorization);

    if (!user) {
      res.status(401).json({ message: "Not signed in." });
      return;
    }

    const groupId = Number(req.params.id);
    const group = await findMemberChat(groupId, user._id);

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    const body = getString(req.body?.body);

    if (!body) {
      res.status(400).json({ message: "Message cannot be empty." });
      return;
    }

    if (body.length > 1000) {
      res.status(400).json({ message: "Message is too long." });
      return;
    }

    const message = await ChatMessageModel.create({
      chat: group._id,
      sender: user._id,
      body,
    });
    const createdAt =
      message.createdAt instanceof Date ? message.createdAt : new Date();
    const updatedGroup = await ChatModel.findByIdAndUpdate(
      group._id,
      {
        lastMessage: `${user.name}: ${body}`,
        time: formatPreviewTime(createdAt),
      },
      { new: true },
    ).populate("members");
    const savedMessage = await ChatMessageModel.findById(message._id)
      .populate("chat")
      .populate("sender");
    const adminUserIds = await findAdminUserIds(group._id);

    if (!updatedGroup || !savedMessage) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    res.status(201).json({
      message: serializeChatMessage(savedMessage, adminUserIds),
      group: serializeChat(updatedGroup),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
