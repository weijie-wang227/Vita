import { Router } from "express";
import { findAuthenticatedUser } from "../auth.js";
import { ChatModel, FeedPostModel } from "../models/MockupData.js";
import { serializeFeedPost } from "../serializers.js";

const router = Router();
const maxCaptionLength = 1200;
const maxImageLength = 5_000_000;

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function nextMockId() {
  const lastPost = await FeedPostModel.findOne()
    .sort({ mockId: -1 })
    .select("mockId");

  return (lastPost?.mockId ?? 0) + 1;
}

router.get("/", async (_req, res) => {
  const posts = await FeedPostModel.find()
    .populate("user")
    .populate("activity")
    .populate("group")
    .sort({ mockId: 1 });
  const serializedPosts = posts.map(serializeFeedPost);

  serializedPosts.sort((a, b) => {
    const aIsFresh = a.time === "Just now";
    const bIsFresh = b.time === "Just now";

    if (aIsFresh && bIsFresh) {
      return b.id - a.id;
    }

    if (aIsFresh) {
      return -1;
    }

    if (bIsFresh) {
      return 1;
    }

    return 0;
  });

  res.json(serializedPosts);
});

router.post("/", async (req, res, next) => {
  try {
    const user = await findAuthenticatedUser(req.headers.authorization);

    if (!user) {
      res.status(401).json({ message: "Not signed in." });
      return;
    }

    const caption = getString(req.body?.caption);
    const image = getString(req.body?.image);
    const groupId =
      req.body?.groupId === undefined || req.body?.groupId === null
        ? null
        : Number(req.body.groupId);

    if (!caption) {
      res.status(400).json({ message: "Post caption cannot be empty." });
      return;
    }

    if (caption.length > maxCaptionLength) {
      res.status(400).json({ message: "Post caption is too long." });
      return;
    }

    if (image && image.length > maxImageLength) {
      res.status(400).json({ message: "Image is too large." });
      return;
    }

    if (groupId !== null && !Number.isInteger(groupId)) {
      res.status(400).json({ message: "Choose a valid group." });
      return;
    }

    const group =
      groupId === null
        ? null
        : await ChatModel.findOne({ mockId: groupId, members: user._id });

    if (groupId !== null && !group) {
      res.status(400).json({
        message: "You can only reference groups you have joined.",
      });
      return;
    }

    const post = await FeedPostModel.create({
      mockId: await nextMockId(),
      user: user._id,
      group: group?._id,
      time: "Just now",
      caption,
      image: image || undefined,
      likes: 0,
      comments: 0,
    });
    const savedPost = await FeedPostModel.findById(post._id)
      .populate("user")
      .populate("activity")
      .populate("group");

    if (!savedPost) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.status(201).json(serializeFeedPost(savedPost));
  } catch (error) {
    next(error);
  }
});

export default router;
