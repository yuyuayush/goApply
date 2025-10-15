import dbConnect from "@/lib/mongodb";
import Settings from "@/model/Settings";
import { getUserFromRequest } from "@/lib/auth";

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get current user's settings
 *     description: Returns the authenticated user's settings.
 *     tags:
 *       - Settings
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer <JWT_TOKEN>"
 *     responses:
 *       200:
 *         description: User settings retrieved successfully
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Server error
 */
export async function GET(req) {
    await dbConnect();
    try {
        const user = await getUserFromRequest(req);

        let settings = await Settings.findOne({ userId: user._id });
        if (!settings) {
            // Create default settings if not exist
            settings = await Settings.create({ userId: user._id });
        }

        return Response.json({ settings }, { status: 200 });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 401 });
    }
}


/**
 * @swagger
 * /api/settings:
 *   put:
 *     summary: Update current user's settings
 *     description: Updates notification preferences, reminder days, and other settings.
 *     tags:
 *       - Settings
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
 *               notificationPreferences:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: boolean
 *                   sms:
 *                     type: boolean
 *                   push:
 *                     type: boolean
 *               reminderDays:
 *                 type: number
 *               theme:
 *                 type: string
 *                 enum: [light, dark]
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Server error
 */
export async function PUT(req) {
    await dbConnect();
    try {
        const user = await getUserFromRequest(req);
        const body = await req.json();
        const { notificationPreferences, reminderDays, theme } = body;

        let settings = await Settings.findOne({ userId: user._id });
        if (!settings) {
            settings = new Settings({ userId: user._id });
        }

        if (notificationPreferences) settings.notificationPreferences = notificationPreferences;
        if (reminderDays !== undefined) settings.reminderDays = reminderDays;
        if (theme) settings.theme = theme;

        settings.updatedAt = new Date();
        await settings.save();

        return Response.json({ settings }, { status: 200 });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 401 });
    }
}

