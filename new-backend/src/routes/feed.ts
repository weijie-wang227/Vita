import { Router } from "express";
import { FeedPostModel } from "../models/MockupData.js";
import { serializeFeedPost } from "../serializers.js";

const router = Router();

router.get("/", async (_req, res) => {
  const posts = await FeedPostModel.find()
    .populate("user")
    .populate("activity")
    .sort({ mockId: 1 });
  res.json(posts.map(serializeFeedPost));
});

export default router;
