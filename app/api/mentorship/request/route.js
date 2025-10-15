import dbConnect from "@/lib/mongodb";
import Mentorship from "@/model/Mentorship";
import { getUserFromRequest } from "@/lib/auth";

/**
 * @swagger
 * /api/mentorship/request:
 *   post:
 *     summary: Request mentorship session
 *     description: Allows a user to request a mentorship session with a specific mentor.
 *     tags:
 *       - Mentorship
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer <JWT_TOKEN>"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mentorId:
 *                 type: string
 *                 example: "64f1b7a2c1234567890abcd1"
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-20T10:00:00Z"
 *               notes:
 *                 type: string
 *                 example: "I would like guidance on career in frontend development."
 *     responses:
 *       200:
 *         description: Mentorship request created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export async function POST(req) {
    await dbConnect();
    try {
        const user = await getUserFromRequest(req);
        const body = await req.json();
        const { mentorId, scheduledAt, notes } = body;

        if (!mentorId) throw new Error("Mentor ID is required");

        const mentorship = await Mentorship.create({
            userId: user._id,
            mentorId,
            scheduledAt,
            notes,
            status: "pending"
        });

        return Response.json({ mentorship }, { status: 200 });
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.message === "Mentor ID is required" ? 400 : 500 });
    }
}
