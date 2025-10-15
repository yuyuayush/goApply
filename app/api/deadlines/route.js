import dbConnect from "@/lib/mongodb";
import Deadline from "@/model/Deadline";
import { getUserFromRequest } from "@/lib/auth";

/**
 * @swagger
 * /api/deadlines:
 *   get:
 *     summary: Get upcoming deadlines for the current user
 *     tags:
 *       - Deadlines
 *     responses:
 *       200:
 *         description: List of deadlines
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new deadline/reminder
 *     tags:
 *       - Deadlines
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicationId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Deadline created
 *       401:
 *         description: Unauthorized
 */
export default async function handler(req, res) {
    await dbConnect();
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    try {
        switch (req.method) {
            case "GET":
                const deadlines = await Deadline.find({ userId: user.id }).sort({ date: 1 });
                return res.status(200).json(deadlines);

            case "POST":
                const { applicationId, date, type, description } = req.body;
                if (!date || !type || !description) return res.status(400).json({ error: "Missing required fields" });

                const newDeadline = new Deadline({
                    userId: user.id,
                    applicationId,
                    date,
                    type,
                    description,
                });

                await newDeadline.save();
                return res.status(201).json(newDeadline);

            default:
                return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
