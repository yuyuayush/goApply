import dbConnect from "@/lib/mongodb";
import Contact from "@/model/Contact";

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit contact form
 *     description: Accepts contact form data (name, email, phone, country, message) and stores it for admin/support.
 *     tags:
 *       - Contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ayush Negi"
 *               email:
 *                 type: string
 *                 example: "ayush@example.com"
 *               phone:
 *                 type: string
 *                 example: "+91 9876543210"
 *               country:
 *                 type: string
 *                 example: "India"
 *               message:
 *                 type: string
 *                 example: "I need support regarding my account."
 *     responses:
 *       201:
 *         description: Contact form submitted successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
export async function POST(req) {
    await dbConnect();

    try {
        const body = await req.json();
        const { name, email, phone, country, message } = body;

        // Validation
        if (!name || !email || !message) {
            return Response.json({ error: "Name, email, and message are required" }, { status: 400 });
        }

        // Create contact document
        const contact = await Contact.create({ name, email, phone, country, message });

        // Optionally: send email to admin/support here
        // await sendEmailToAdmin(contact);

        return Response.json({ message: "Contact form submitted successfully", contact }, { status: 201 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
