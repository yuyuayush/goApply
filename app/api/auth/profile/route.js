import dbConnect from "@/lib/mongodb";
import User from "@/model/User";
import UserProfile from "@/model/UserProfile";
import { verifyToken } from "@/lib/jwt";
import {getUserFromToken} from "../../../../lib/auth";

/**
 * Extracts user info from JWT token sent in the request body.
 */

export async function GET(req){
    await dbConnect();
    try {
        const user = await getUserFromToken(req);
        console.log(user);
        const profile = await UserProfile.findOne({ userId: user._id });
        return Response.json({ user, profile }, { status: 200 });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 401 });
    }
}

/**
 * @swagger
 * /api/auth/profile:
 *   post:
 *     summary: Get current user's profile
 *     description: Returns the authenticated user's information and profile details using a token sent in the body.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: User and profile fetched successfully
 *       401:
 *         description: Invalid or missing token
 */
export async function POST(req) {
    await dbConnect();
    try {
        const user = await getUserFromToken(req);
        console.log(user);
        const profile = await UserProfile.findOne({ userId: user._id });
        return Response.json({ user, profile }, { status: 200 });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 401 });
    }
}

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update current user's profile
 *     description: Updates user and profile data based on token provided in the request body.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               firstName:
 *                 type: string
 *                 example: "Ayush"
 *               lastName:
 *                 type: string
 *                 example: "Negi"
 *               profile:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                     example: "+91 9876543210"
 *                   nationalities:
 *                     type: string
 *                     example: "Indian"
 *     responses:
 *       200:
 *         description: User and profile updated successfully
 *       401:
 *         description: Unauthorized, token missing or invalid
 */


export async function PUT(req) {
    try {
        // ✅ Step 1: Connect to MongoDB
        await dbConnect();

        // ✅ Step 2: Extract token from header
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("❌ Token not provided in Authorization header");
            return Response.json(
                { success: false, error: "Token not provided" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        // ✅ Step 3: Verify token
        let decoded;
        try {
            decoded = verifyToken(token);
        } catch (err) {
            console.error("❌ Invalid token:", err.message);
            return Response.json(
                { success: false, error: "Invalid or expired token" },
                { status: 401 }
            );
        }

        // ✅ Step 4: Parse body
        let body;
        try {
            body = await req.json();
        } catch (err) {
            console.error("❌ Invalid JSON body:", err.message);
            return Response.json(
                { success: false, error: "Invalid JSON body" },
                { status: 400 }
            );
        }

        const { firstName, lastName, profile: profileData } = body;

        // ✅ Step 5: Find the user
        const user = await User.findById(decoded.userId);
        if (!user) {
            console.error("❌ User not found:", decoded.userId);
            return Response.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        // ✅ Step 6: Update user fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        user.updatedAt = new Date();
        await user.save();

        // ✅ Step 7: Update or create profile
        let profile = await UserProfile.findOne({ userId: user._id });
        if (!profile) {
            console.log("ℹ️ Creating new profile for user:", user._id);
            profile = new UserProfile({ userId: user._id });
        }

        Object.assign(profile, profileData || {});
        profile.updatedAt = new Date();
        await profile.save();

        // ✅ Step 8: Success response
        console.log("✅ Profile updated successfully for user:", user._id);
        return Response.json(
            {
                success: true,
                message: "Profile updated successfully",
                user,
                profile,
            },
            { status: 200 }
        );

    } catch (err) {
        // ✅ Step 9: Catch-all error
        console.error("🔥 Unexpected server error:", err);
        return Response.json(
            {
                success: false,
                error: err.message || "Internal server error",
                stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
            },
            { status: 500 }
        );
    }
}