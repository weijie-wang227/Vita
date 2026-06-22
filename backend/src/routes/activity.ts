import { Router } from "express"
import { authenticateToken, AuthRequest } from "../middleware/auth"
import { Activity, Group } from "../models"

const activityRouter = Router()

activityRouter.get("/", async (req: AuthRequest, res) => {
    try {
        const plans = await Activity.find()
        res.json(plans)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch activities' })
    }
})

activityRouter.post("/add", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;

    const {
      sourceId,
      imageUrl,
      title,
      lng,
      lat,
      type,
      date,
      time,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!sourceId || !title || lat == null || lng == null || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (type !== "groups") {
      return res.status(400).json({ error: "Unexpected activity type" });
    }

    const group = await Group.findById(sourceId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorised" });
    }

    const activity = await Activity.create({
      sourceId,
      imageUrl,
      title,
      lat,
      lng,
      type: "group",
      date,
      time,
    });

    return res.status(201).json(activity);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create activity" });
  }
});

export default activityRouter