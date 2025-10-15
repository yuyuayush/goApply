import dbConnect from "@/lib/mongodb";
import Payment from "@/model/Payment";
import { getUserFromRequest } from "@/lib/auth";

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get payment history for the current user
 *     tags:
 *       - Payments
 *     responses:
 *       200:
 *         description: List of payments
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Initiate a new payment
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicationId:
 *                 type: string
 *               amount:
 *                 type: number
 *               method:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment initiated
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
                const payments = await Payment.find({ userId: user.id }).sort({ paidAt: -1 });
                return res.status(200).json(payments);

            case "POST":
                const { applicationId, amount, method } = req.body;
                if (!applicationId || !amount || !method) {
                    return res.status(400).json({ error: "Missing applicationId, amount, or method" });
                }

                const newPayment = new Payment({
                    userId: user.id,
                    applicationId,
                    amount,
                    method,
                    status: "pending",
                });

                await newPayment.save();
                return res.status(201).json(newPayment);

            default:
                return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
