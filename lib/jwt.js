import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "your-secret-key";

export function signToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
    return jwt.verify(token, SECRET);
}
