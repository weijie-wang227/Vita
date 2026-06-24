import { Router } from "express";
import { ChatModel } from "../models/MockupData.js";
import { serializeChat } from "../serializers.js";

const router = Router();

router.get("/", async (_req, res) => {
  const groups = await ChatModel.find().populate("members").sort({ mockId: 1 });
  res.json(groups.map(serializeChat));
});

router.get("/:id", async (req, res) => {
  const groupId = Number(req.params.id);
  const group = await ChatModel.findOne({ mockId: groupId }).populate("members");

  if (!group) {
    res.status(404).json({ message: "Group not found" });
    return;
  }

  res.json(serializeChat(group));
});

export default router;
