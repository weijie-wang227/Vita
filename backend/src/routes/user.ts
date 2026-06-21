import { Router, Response } from "express";
import { authenticateToken } from "../middleware/auth";
import { AuthRequest} from "../middleware/auth";
import { User } from "../models";

const userRouter = Router()

userRouter.put('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { avatarUrl, bio, name } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(bio !== undefined && { bio }),
        ...(name !== undefined && { name }),
      },
      { returnDocument: "after" },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update profile" });
  }
})

export default userRouter