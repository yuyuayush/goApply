import dbConnect from "@/lib/mongodb";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "ayush@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successful login, returns JWT and user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid email or password"
 */
export async function POST(req) {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return Response.json({ error: "Invalid email or password" }, { status: 401 });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return Response.json({ error: "Invalid email or password" }, { status: 401 });

    const token = signToken({ userId: user._id });
    return Response.json({ token, user }, { status: 200 });
}
