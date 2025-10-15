import dbConnect from "@/lib/mongodb";
import Mentorship from "@/model/Mentorship";

/**
 * @swagger
 * /api/mentorship:
 *   get:
 *     summary: Get available mentors
 *     description: Returns all mentorship requests or available mentors for the current user.
 *     tags:
 *       - Mentorship
 *     responses:
 *       200:
 *         description: List of mentorships retrieved successfully
 *       500:
 *         description: Server error
 */
export async function GET(req) {
    await dbConnect();
    try {
        const mentorships = await Mentorship.find().populate("mentorId", "firstName lastName email");
        return Response.json({ mentorships }, { status: 200 });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}
