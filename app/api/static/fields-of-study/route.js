/**
 * @swagger
 * /api/static/fields-of-study:
 *   get:
 *     summary: Get list of academic fields of study
 *     description: Returns a static list of fields of study for dropdowns or form selections.
 *     tags:
 *       - Static Data
 *     responses:
 *       200:
 *         description: Successfully retrieved list of fields of study
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fields:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - Computer Science
 *                     - Mechanical Engineering
 *                     - Business Administration
 *       500:
 *         description: Server error
 */

export async function GET() {
    try {
        const fieldsOfStudy = [
            "Computer Science",
            "Information Technology",
            "Mechanical Engineering",
            "Electrical Engineering",
            "Civil Engineering",
            "Business Administration",
            "Economics",
            "Psychology",
            "Biotechnology",
            "Mathematics",
            "Physics",
            "Chemistry",
        ];

        return Response.json({ fields: fieldsOfStudy }, { status: 200 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
