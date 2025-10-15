/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: In a stateless JWT system, logging out is handled client-side by clearing the token.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out"
 */
export async function POST() {
    // API response for logout
    return Response.json({ message: "Logged out" }, { status: 200 });
}
