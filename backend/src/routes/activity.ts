import { Router } from "express"
import { authenticateToken, AuthRequest } from "../middleware/auth"
import { Activity } from "../models"

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
        const userId = req.userId

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch activities' })
    }
})

export default activityRouter