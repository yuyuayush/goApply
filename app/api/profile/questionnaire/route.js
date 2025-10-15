import dbConnect from "@/lib/mongodb";
import Questionnaire from "@/model/Questionnaire";
import { getUserFromRequest } from "@/lib/auth";

/**
 * @swagger
 * /api/profile/questionnaire:
 *   get:
 *     summary: Get registration questionnaire for current user
 *     tags:
 *       - Profile
 *     responses:
 *       200:
 *         description: Returns questionnaire steps and saved answers
 *       401:
 *         description: Unauthorized
 */
export default async function handler() {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    try {
        await dbConnect();
        const user = await getUserFromRequest(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const questionnaire = await Questionnaire.find({ userId: user.id }).sort({ step: 1 });

        res.status(200).json({ questionnaire });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

/**
 * @swagger
 * /api/profile/questionnaire:
 *   post:
 *     summary: Save or update questionnaire answers for current user
 *     tags:
 *       - Profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               step:
 *                 type: number
 *               answers:
 *                 type: object
 *     responses:
 *       200:
 *         description: Questionnaire saved successfully
 *       401:
 *         description: Unauthorized
 */
export async function saveQuestionnaire() {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
        await dbConnect();
        const user = await getUserFromRequest(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { step, answers } = req.body;

        let questionnaire = await Questionnaire.findOne({ userId: user?.id, step });
        if (questionnaire) {
            questionnaire.answers = answers;
            questionnaire.updatedAt = new Date();
            await questionnaire.save();
        } else {
            questionnaire = new Questionnaire({
                userId: user?.id,
                step,
                answers,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await questionnaire.save();
        }

        res.status(200).json({ message: "Questionnaire saved successfully", questionnaire });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
