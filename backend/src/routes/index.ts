import { Router } from "express";
import { getMongoConnectionStatus } from "../db.js";
import activityRoutes from "./activities.js";
import authRoutes from "./auth.js";
import feedRoutes from "./feed.js";
import groupRoutes from "./groups.js";
import profileRoutes from "./profile.js";
import settingsRoutes from "./settings.js";
import uploadRoutes from "./uploads.js";

export const router = Router();

function publicMongoStatus() {
  const { error: _error, ...mongo } = getMongoConnectionStatus();

  return mongo;
}

router.get("/health", (_req, res) => {
  const mongo = publicMongoStatus();

  res.json({
    status: mongo.connected ? "ok" : "degraded",
    service: "Vita backend",
    mongo,
  });
});

router.use((_req, res, next) => {
  const mongo = publicMongoStatus();

  if (!mongo.connected) {
    res.status(503).json({
      message:
        mongo.state === "failed"
          ? "MongoDB connection failed."
          : `MongoDB is ${mongo.state}.`,
      mongo,
    });
    return;
  }

  next();
});

router.use("/auth", authRoutes);
router.use("/activities", activityRoutes);
router.use("/feed", feedRoutes);
router.use("/groups", groupRoutes);
router.use("/settings", settingsRoutes);
router.use("/uploads", uploadRoutes);
router.use("/", profileRoutes);
