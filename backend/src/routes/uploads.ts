import crypto from "crypto";
import { Router } from "express";
import { authenticateToken, type AuthRequest } from "../middleware/auth";
import { createUploadUrl } from "../lib/r2";

const uploadRouter = Router();

const safeFolders = ["profiles", "classes", "post", "groups", "activities"]

uploadRouter.post(
  "/presigned-url",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.userId;
      const { fileName, contentType, folder } = req.body;

      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!contentType || !allowedImageTypes.includes(contentType)) {
        return res.status(400).json({ error: "Invalid image type" });
      }

      const safeFolder =
        folder in safeFolders
          ? folder
          : "misc";

      const extension =
        contentType === "image/jpeg"
          ? ".jpg"
          : contentType === "image/png"
            ? ".png"
            : contentType === "image/webp"
              ? ".webp"
              : "";

      let key: string;

      if (safeFolder === "profiles") {
        key = `profiles/${userId}/avatar${extension}`;
      } else {
        key = `${safeFolder}/${userId}/${crypto.randomUUID()}${extension}`;
      }

      const uploadUrl = await createUploadUrl({
        key,
        contentType,
      });

      const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

      res.json({
        uploadUrl,
        key,
        publicUrl,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create upload URL" });
    }
  },
);

export default uploadRouter;