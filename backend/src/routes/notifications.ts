import { Router } from "express";
import { findAuthenticatedUser } from "../auth.js";
import { NotificationModel } from "../models/VidaData.js";
import { serializeNotification } from "../serializers.js";

const router = Router();

router.get("/", async (req, res) => {
  const authUser = await findAuthenticatedUser(req.headers.authorization);

  if (!authUser) {
    res.status(401).json({ message: "Not signed in." });
    return;
  }

  const notifications = await NotificationModel.find({ user: authUser._id }).sort({
    dateReceived: -1,
  });

  res.json(notifications.map(serializeNotification));
});

export default router;
