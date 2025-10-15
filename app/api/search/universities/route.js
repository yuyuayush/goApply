import dbConnect from "@/lib/mongodb";
import University from "@/model/University";

/**
 * @swagger
 * /api/search/universities:
 *   get:
 *     summary: Search universities
 *     description: Returns universities matching the search query `q`.
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
 *         description: List of universities matching the query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 universities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/University'
 *       500:
 *         description: Server error
 */
export async function GET(req) {
    await dbConnect();

    try {
        const url = new URL(req.url);
        const query = url.searchParams.get("q") || "";

        const universities = await University.find({
            name: { $regex: query, $options: "i" },
        }).limit(20);

        return Response.json({ universities }, { status: 200 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
