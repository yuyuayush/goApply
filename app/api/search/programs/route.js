import dbConnect from "@/lib/mongodb";
import Program from "@/model/Program";

/**
 * @swagger
 * /api/search/programs:
 *   get:
 *     summary: Search programs
 *     description: Returns programs matching the search query `q`.
 *     tags:
 *       - Search
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of programs matching the query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 programs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Program'
 *       500:
 *         description: Server error
 */
export async function GET(req) {
    await dbConnect();

    try {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";

        const programs = await Program.find({
            name: { $regex: query, $options: "i" },
        }).limit(20);

        return Response.json({ programs }, { status: 200 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
