import { Router } from "express";
import { findAuthenticatedUser } from "../auth.js";
import {
  AdminModel,
  ActivityJoinModel,
  ActivityModel,
  ChatModel,
  MapPinModel,
} from "../models/MockupData.js";
import { serializeActivity, serializeChat, serializeMapPin } from "../serializers.js";

const router = Router();
const vitaCategories = new Set([
  "physical",
  "social",
  "cognitive",
  "creative",
]);

function asObject(doc: Record<string, any>) {
  return typeof doc.toObject === "function" ? doc.toObject() : doc;
}

async function getJoiningUsersByActivityId(activities: Record<string, any>[]) {
  const activityIds = activities.map((activity) => activity._id);
  const joins = await ActivityJoinModel.find({ activityId: { $in: activityIds } })
    .populate("userId")
    .sort({ createdAt: 1 });
  const usersByActivityId = new Map<string, Record<string, any>[]>();

  for (const join of joins) {
    const item = asObject(join);
    const activityId = String(item.activityId?._id ?? item.activityId);
    const users = usersByActivityId.get(activityId) ?? [];

    users.push(item.userId);
    usersByActivityId.set(activityId, users);
  }

  return usersByActivityId;
}

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getFiniteNumber(value: unknown) {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : null;
}

function formatDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatTime(value: string) {
  const match = value.match(/^(\d{2}):(\d{2})$/);

  if (!match) {
    return value;
  }

  const hour = Number(match[1]);
  const minutes = match[2];
  const displayHour = hour % 12 || 12;
  const suffix = hour < 12 ? "AM" : "PM";

  return `${displayHour}:${minutes} ${suffix}`;
}

async function nextMockId(model: typeof ActivityModel) {
  const lastItem = await model.findOne().sort({ mockId: -1 }).select("mockId");

  return (lastItem?.mockId ?? 0) + 1;
}

router.get("/", async (_req, res) => {
  const activities = await ActivityModel.find({ isPremium: false })
    .populate("host")
    .sort({ mockId: 1 });
  const joiningUsersByActivityId = await getJoiningUsersByActivityId(activities);

  res.json(
    activities.map((activity) =>
      serializeActivity(
        activity,
        joiningUsersByActivityId.get(String(activity._id)) ?? [],
      ),
    ),
  );
});

router.get("/premium", async (_req, res) => {
  const activities = await ActivityModel.find({ isPremium: true })
    .populate("host")
    .sort({ mockId: 1 });
  const joiningUsersByActivityId = await getJoiningUsersByActivityId(activities);

  res.json(
    activities.map((activity) =>
      serializeActivity(
        activity,
        joiningUsersByActivityId.get(String(activity._id)) ?? [],
      ),
    ),
  );
});

router.get("/map-pins", async (_req, res) => {
  const pins = await MapPinModel.find()
    .populate("activity")
    .sort({ mockId: 1 });
  res.json(pins.map(serializeMapPin));
});

router.post("/", async (req, res, next) => {
  try {
    const user = await findAuthenticatedUser(req.headers.authorization);

    if (!user) {
      res.status(401).json({ message: "Not signed in." });
      return;
    }

    const title = getString(req.body?.title);
    const date = getString(req.body?.date);
    const time = getString(req.body?.time);
    const location = getString(req.body?.location);
    const latitude = getFiniteNumber(req.body?.latitude);
    const longitude = getFiniteNumber(req.body?.longitude);
    const durationMinutes = getFiniteNumber(req.body?.durationMinutes);
    const spots = getFiniteNumber(req.body?.spots);
    const price = getString(req.body?.price) || "0 credits";
    const categories: string[] = Array.isArray(req.body?.categories)
      ? req.body.categories.map(getString).filter(Boolean)
      : [];

    if (!title || !date || !time || !location) {
      res.status(400).json({
        message: "Title, date, time, and location are required.",
      });
      return;
    }

    if (
      latitude === null ||
      longitude === null ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      res.status(400).json({ message: "Choose a valid pin location." });
      return;
    }

    if (durationMinutes === null || durationMinutes < 15) {
      res.status(400).json({
        message: "Duration must be at least 15 minutes.",
      });
      return;
    }

    if (spots === null || spots < 1) {
      res.status(400).json({ message: "Spots must be at least 1." });
      return;
    }

    if (
      categories.length === 0 ||
      categories.some((category) => !vitaCategories.has(category))
    ) {
      res.status(400).json({ message: "Choose at least one valid category." });
      return;
    }

    const [activityMockId, chatMockId, mapPinMockId] = await Promise.all([
      nextMockId(ActivityModel),
      nextMockId(ChatModel),
      nextMockId(MapPinModel),
    ]);
    const chat = await ChatModel.create({
      mockId: chatMockId,
      name: title,
      avatar: `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(
        title,
      )}`,
      members: [user._id],
      lastMessage: "",
      time: "",
      unread: 0,
    });
    await AdminModel.create({
      user: user._id,
      group: chat._id,
    });
    const activity = await ActivityModel.create({
      mockId: activityMockId,
      title,
      host: user._id,
      date: formatDate(date),
      time: formatTime(time),
      location,
      durationMinutes: Math.round(durationMinutes),
      spots: Math.round(spots),
      price,
      rating: 5,
      categories,
      chat: chat._id,
      isPremium: false,
      tags: [],
    });
    const pin = await MapPinModel.create({
      mockId: mapPinMockId,
      activity: activity._id,
      latitude,
      longitude,
      label: title,
      premium: false,
    });

    await ActivityJoinModel.create({
      userId: user._id,
      activityId: activity._id,
    });

    const savedActivity = await ActivityModel.findById(activity._id).populate(
      "host",
    );
    const savedPin = await MapPinModel.findById(pin._id).populate("activity");
    const savedChat = await ChatModel.findById(chat._id).populate("members");

    res.status(201).json({
      activity: serializeActivity(savedActivity, [user]),
      mapPin: serializeMapPin(savedPin),
      group: serializeChat(savedChat),
    });
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

    const activityId = Number(req.params.id);
    const activity = await ActivityModel.findOne({ mockId: activityId }).populate(
      "host",
    );

    if (!activity) {
      res.status(404).json({ message: "Activity not found" });
      return;
    }

    await ActivityJoinModel.updateOne(
      { userId: user._id, activityId: activity._id },
      { $setOnInsert: { userId: user._id, activityId: activity._id } },
      { upsert: true },
    );

    const group = await ChatModel.findByIdAndUpdate(
      activity.chat,
      { $addToSet: { members: user._id } },
      { new: true },
    ).populate("members");

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    const joiningUsersByActivityId = await getJoiningUsersByActivityId([
      activity,
    ]);

    res.json({
      activity: serializeActivity(
        activity,
        joiningUsersByActivityId.get(String(activity._id)) ?? [],
      ),
      group: serializeChat(group),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res) => {
  const activityId = Number(req.params.id);
  const activity = await ActivityModel.findOne({ mockId: activityId }).populate(
    "host",
  );

  if (!activity) {
    res.status(404).json({ message: "Activity not found" });
    return;
  }

  const joiningUsersByActivityId = await getJoiningUsersByActivityId([activity]);

  res.json(
    serializeActivity(
      activity,
      joiningUsersByActivityId.get(String(activity._id)) ?? [],
    ),
  );
});

export default router;
