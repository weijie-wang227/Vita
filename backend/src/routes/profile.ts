import { Router } from "express";
import { Types } from "mongoose";
import {
  createAvatarUrl,
  findAuthenticatedUser,
  normalizeHandle,
} from "../auth.js";
import { FriendshipModel, UserModel } from "../models/VitaData.js";
import { serializeFriend, serializeProfile } from "../serializers.js";

const router = Router();
const maxNameLength = 80;
const maxBioLength = 240;

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function hasHandleCharacters(value: string) {
  return /[a-z0-9_]/i.test(value.replace(/^@+/, ""));
}

function getRequestedAvatar(body: Record<string, unknown> | undefined) {
  return getString(body?.avatar ?? body?.profile ?? body?.avatarUrl);
}

function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === 11000
  );
}

async function findHandleOverlap(handle: string, userId: unknown) {
  return UserModel.exists({
    _id: { $ne: userId },
    handle,
  });
}

router.get("/profile", async (req, res) => {
  const authUser = await findAuthenticatedUser(req.headers.authorization);

  if (authUser) {
    res.json(serializeProfile(authUser));
    return;
  }

  res.status(401).json({ message: "Not signed in." });
});

router.get("/profile/handle-availability", async (req, res) => {
  const authUser = await findAuthenticatedUser(req.headers.authorization);

  if (!authUser) {
    res.status(401).json({ message: "Not signed in." });
    return;
  }

  const requestedHandle = getString(req.query.handle);

  if (!requestedHandle || !hasHandleCharacters(requestedHandle)) {
    res.status(400).json({
      message: "Handle must include letters, numbers, or underscores.",
    });
    return;
  }

  const handle = normalizeHandle(requestedHandle, authUser.handle);
  const overlappingUser = await findHandleOverlap(handle, authUser._id);

  res.json({
    handle,
    available: !overlappingUser,
    message: overlappingUser
      ? "That handle is already in use. Please choose another."
      : "",
  });
});

router.put("/profile", async (req, res, next) => {
  try {
    const authUser = await findAuthenticatedUser(req.headers.authorization);

    if (!authUser) {
      res.status(401).json({ message: "Not signed in." });
      return;
    }

    const name = getString(req.body?.name);
    const requestedHandle = getString(req.body?.handle);
    const bio = getString(req.body?.bio);
    const requestedAvatar = getRequestedAvatar(req.body);

    if (!name) {
      res.status(400).json({ message: "Name is required." });
      return;
    }

    if (name.length > maxNameLength) {
      res
        .status(400)
        .json({ message: `Name must be ${maxNameLength} characters or less.` });
      return;
    }

    if (!requestedHandle || !hasHandleCharacters(requestedHandle)) {
      res.status(400).json({
        message: "Handle must include letters, numbers, or underscores.",
      });
      return;
    }

    if (bio.length > maxBioLength) {
      res
        .status(400)
        .json({ message: `Bio must be ${maxBioLength} characters or less.` });
      return;
    }

    const handle = normalizeHandle(requestedHandle, name);
    const overlappingUser = await findHandleOverlap(handle, authUser._id);

    if (overlappingUser) {
      res.status(409).json({
        message: "That handle is already in use. Please choose another.",
        field: "handle",
        handle,
      });
      return;
    }

    const avatarUrl =
      requestedAvatar || authUser.avatarUrl || createAvatarUrl(name, authUser.email);
    const updatedUser = await UserModel.findByIdAndUpdate(
      authUser._id,
      {
        $set: {
          name,
          handle,
          avatarUrl,
          bio,
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      res.status(404).json({ message: "Profile not found." });
      return;
    }

    res.json(serializeProfile(updatedUser));
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      res.status(409).json({
        message: "That handle is already in use. Please choose another.",
        field: "handle",
      });
      return;
    }

    next(error);
  }
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
        joined: [],
      },
    },
    { upsert: true, setDefaultsOnInsert: true },
  );

  res.json(serializeFriend(friendship));
});

export default router;
