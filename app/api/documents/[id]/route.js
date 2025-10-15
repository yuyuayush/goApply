import dbConnect from "@/lib/mongodb";
import Document from "@/model/Document";
import { getUserFromRequest } from "@/lib/auth";

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     summary: Delete a document by ID
 *     tags:
 *       - Documents
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document deleted
 *       404:
 *         description: Document not found
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

        const deleted = await Document.findOneAndDelete({ _id: id, userId: user.id });
        if (!deleted) return res.status(404).json({ error: "Document not found" });

        return res.status(200).json({ message: "Document deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
