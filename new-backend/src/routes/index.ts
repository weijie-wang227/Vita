import { Router } from "express";
import { isMongoConnected } from "../db.js";
import activityRoutes from "./activities.js";
import authRoutes from "./auth.js";
import feedRoutes from "./feed.js";
import groupRoutes from "./groups.js";
import profileRoutes from "./profile.js";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "Mobile Activity mockup backend" });
});

router.use((_req, res, next) => {
  if (!isMongoConnected()) {
    res.status(503).json({ message: "MongoDB is not connected." });
    return;
  }

  next();
});

router.use("/auth", authRoutes);
router.use("/activities", activityRoutes);
router.use("/feed", feedRoutes);
router.use("/groups", groupRoutes);
router.use("/", profileRoutes);
