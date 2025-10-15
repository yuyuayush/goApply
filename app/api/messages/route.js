import dbConnect from "@/lib/mongodb";
import Message from "@/model/Message";
import { getUserFromRequest } from "@/lib/auth";

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get messages for the current user
 *     tags:
 *       - Messages
 *     responses:
 *       200:
 *         description: List of messages
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Send a new message
 *     tags:
 *       - Messages
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
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
                const messages = await Message.find({ userId: user.id }).sort({ sentAt: -1 });
                return res.status(200).json(messages);

            case "POST":
                const { recipientId, content } = req.body;
                if (!recipientId || !content) return res.status(400).json({ error: "Missing recipientId or content" });

                const newMessage = new Message({
                    userId: recipientId,
                    senderId: user.id,
                    content,
                });

                await newMessage.save();
                return res.status(201).json(newMessage);

            default:
                return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
