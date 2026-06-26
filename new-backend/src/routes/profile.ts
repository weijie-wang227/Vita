import { Router } from "express";
import { Types } from "mongoose";
import { findAuthenticatedUser } from "../auth.js";
import { FriendshipModel, UserModel } from "../models/VitaData.js";
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

router.post("/friends/add/:friendId", async (req, res) => {
  const authUser = await findAuthenticatedUser(req.headers.authorization);

  if (!authUser) {
    res.status(401).json({ message: "Not signed in." });
    return;
  }

  const userId = String(authUser._id);
  const friendId = String(req.params.friendId ?? "").trim();

  if (!friendId) {
    res.status(400).json({ message: "Friend ID is required." });
    return;
  }

  if (!Types.ObjectId.isValid(friendId)) {
    res.status(404).json({ message: "Friend not found." });
    return;
  }

  if (friendId === userId) {
    res.status(400).json({ message: "You cannot add yourself as a friend." });
    return;
  }

  const friendUser = await UserModel.findById(friendId);

  if (!friendUser) {
    res.status(404).json({ message: "Friend not found." });
    return;
  }

  const friendship = await FriendshipModel.findOneAndUpdate(
    { userId: authUser._id, friendId: friendUser._id },
    {
      $setOnInsert: {
        userId: authUser._id,
        friendId: friendUser._id,
        mutual: 0,
        joined: [],
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).populate("friendId");

  await FriendshipModel.updateOne(
    { userId: friendUser._id, friendId: authUser._id },
    {
      $setOnInsert: {
        userId: friendUser._id,
        friendId: authUser._id,
        mutual: 0,
        joined: [],
      },
    },
    { upsert: true, setDefaultsOnInsert: true },
  );

  res.json(serializeFriend(friendship));
});

export default router;
