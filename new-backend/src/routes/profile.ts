import { Router } from "express";
import { findAuthenticatedUser } from "../auth.js";
import { FriendshipModel } from "../models/MockupData.js";
import { serializeFriend, serializeProfile } from "../serializers.js";

const router = Router();

router.get("/profile", async (req, res) => {
  const authUser = await findAuthenticatedUser(req.headers.authorization);

  if (authUser) {
    res.json(serializeProfile(authUser));
    return;
  }

  res.status(401).json({ message: "Not signed in." });
});

router.get("/friends", async (req, res) => {
  const authUser = await findAuthenticatedUser(req.headers.authorization);

  if (!authUser) {
    res.status(401).json({ message: "Not signed in." });
    return;
  }

  const savedFriends = await FriendshipModel.find({ userId: authUser._id })
    .populate("friendId")
    .sort({ createdAt: 1 });
  res.json(savedFriends.map(serializeFriend));
});

export default router;
