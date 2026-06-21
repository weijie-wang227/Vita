import { Plan, User } from '../models'
import { Router } from 'express'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const planRouter = Router()

planRouter.get('/', async (req, res) => {
    try {
        const plans = await Plan.find()
        res.json(plans)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch plans' })
    }
})

planRouter.put(
  "/:id/subscribe",
  authenticateToken,
  async (req: AuthRequest, res) => {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!id) {
      return res.status(400).json({ error: "Plan ID is required" });
    }
    try {
      const plan = await Plan.findById(id);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          membershipPlanId: plan._id,
        },
        {
          returnDocument: "after",
        }
      )
        .select("-password")
        .populate('membershipPlanId');

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to subscribe to plan" });
    }
  }
);

export default planRouter