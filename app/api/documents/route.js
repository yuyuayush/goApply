import dbConnect from "@/lib/mongodb";
import Document from "@/model/Document";
import { getUserFromRequest } from "@/lib/auth";

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Get all documents for the current user
 *     tags:
 *       - Documents
 *     responses:
 *       200:
 *         description: List of documents
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Upload a new document
 *     tags:
 *       - Documents
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicationId:
 *                 type: string
 *               type:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document uploaded
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
                const documents = await Document.find({ userId: user.id }).sort({ uploadedAt: -1 });
                return res.status(200).json(documents);

            case "POST":
                const { applicationId, type, url } = req.body;
                if (!type || !url) return res.status(400).json({ error: "Type and URL are required" });

                const newDoc = new Document({
                    userId: user.id,
                    applicationId,
                    type,
                    url
                });
                await newDoc.save();
                return res.status(201).json(newDoc);

            default:
                return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
