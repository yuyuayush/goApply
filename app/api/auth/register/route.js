import dbConnect from "@/lib/mongodb";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
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
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 example: "ayush@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               firstName:
 *                 type: string
 *                 example: "Ayush"
 *               lastName:
 *                 type: string
 *                 example: "Negi"
 *     responses:
 *       201:
 *         description: User created successfully and JWT returned
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
 *       400:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong"
 */
export async function POST(req) {
    try {
        await dbConnect();
        const { email, password, firstName, lastName } = await req.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return Response.json({ error: "Email already exists" }, { status: 400 });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({ email, passwordHash, firstName, lastName });

        // Sign JWT
        const token = signToken({ userId: user._id });

        return Response.json({ token, user }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /auth/register:", error);
        return Response.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}
