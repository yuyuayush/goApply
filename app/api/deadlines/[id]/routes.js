import dbConnect from "@/lib/mongodb";
import Deadline from "@/model/Deadline";
import { getUserFromRequest } from "@/lib/auth";

/**
 * @swagger
 * /api/deadlines/{id}:
 *   delete:
 *     summary: Delete a deadline by ID
 *     tags:
 *       - Deadlines
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deadline ID
 *     responses:
 *       200:
 *         description: Deadline deleted
 *       404:
 *         description: Deadline not found
 *       401:
 *         description: Unauthorized
 */
export default async function handler(req, res) {
  await dbConnect();
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { id } = req.query;

  try {
    if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });

    const deleted = await Deadline.findOneAndDelete({ _id: id, userId: user.id });
    if (!deleted) return res.status(404).json({ error: "Deadline not found" });

    return res.status(200).json({ message: "Deadline deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
