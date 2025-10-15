import User from "@/model/User";
import { verifyToken } from "@/lib/jwt";

/**
 * Extracts and verifies the JWT from the request headers and returns the user.
 * @param {Request} req - Next.js API request
 * @returns {Promise<User>} - The authenticated user
 * @throws {Error} - If token is missing, invalid, or user not found
 */
export async function getUserFromRequest(req) {
    try {
        // Read Authorization header
        const authHeader = req.headers.get("authorization");
        if (!authHeader) throw new Error("Authorization header missing");

        const token = authHeader.split(" ")[1]; // Expect "Bearer <token>"
        if (!token) throw new Error("Token missing");

        // Verify JWT
        const decoded = verifyToken(token);
        if (!decoded?.userId) throw new Error("Invalid token");

        // Find user in MongoDB
        const user = await User.findById(decoded.userId);
        if (!user) throw new Error("User not found");

        return user;
    } catch (err) {
        throw new Error(err.message || "Unauthorized");
    }
}

export async function getUserFromToken(req) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) throw new Error("Authorization header missing");

        const token = authHeader.split(" ")[1];
        if (!token) throw new Error("Token not provided");

        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) throw new Error("Invalid token payload");

        const user = await User.findById(decoded.userId);
        if (!user) throw new Error("User not found");

        return user;
    } catch (err) {
        console.error("Error in getUserFromToken:", err.message);
        throw new Error("Unauthorized: " + err.message);
    }
}
