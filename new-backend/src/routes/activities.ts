import { Router } from "express";
import {
  ActivityJoinModel,
  ActivityModel,
  MapPinModel,
} from "../models/MockupData.js";
import { serializeActivity, serializeMapPin } from "../serializers.js";

const router = Router();

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
