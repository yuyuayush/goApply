/**
 * @swagger
 * /api/static/nationalities:
 *   get:
 *     summary: Get list of nationalities
 *     description: Returns a static list of nationalities for dropdowns or registration forms.
 *     tags:
 *       - Static Data
 *     responses:
 *       200:
 *         description: Successfully retrieved list of nationalities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nationalities:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - Indian
 *                     - American
 *                     - British
 *       500:
 *         description: Server error
 */

export async function GET() {
    try {
        const nationalities = [
            "Indian",
            "American",
            "British",
            "Canadian",
            "Australian",
            "Chinese",
            "Japanese",
            "German",
            "French",
            "Italian",
            "Brazilian",
            "South African",
        ];

        return Response.json({ nationalities }, { status: 200 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
