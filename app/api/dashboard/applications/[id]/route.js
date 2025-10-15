import dbConnect from "@/lib/mongodb";
import Application from "@/model/Application";
import { getUserFromRequest } from "@/lib/auth";

// Dynamic route handler for a single application
export async function GET(req) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // or get id from req.nextUrl if using Next.js App Router
    const user = await getUserFromRequest(req);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    if (!id) return new Response(JSON.stringify({ error: "Application ID required" }), { status: 400 });

    try {
        const app = await Application.findOne({ _id: id, userId: user.id });
        if (!app) return new Response(JSON.stringify({ error: "Application not found" }), { status: 404 });
        return new Response(JSON.stringify(app), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

export async function PUT(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const user = await getUserFromRequest(req);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    if (!id) return new Response(JSON.stringify({ error: "Application ID required" }), { status: 400 });

    try {
        const body = await req.json();
        const updateData = { ...body, updatedAt: new Date() };
        if (body.status === "submitted") updateData.submittedAt = new Date();

        const updatedApp = await Application.findOneAndUpdate(
            { _id: id, userId: user.id },
            updateData,
            { new: true }
        );

        if (!updatedApp) return new Response(JSON.stringify({ error: "Application not found" }), { status: 404 });
        return new Response(JSON.stringify(updatedApp), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

export async function DELETE(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const user = await getUserFromRequest(req);
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    if (!id) return new Response(JSON.stringify({ error: "Application ID required" }), { status: 400 });

    try {
        const deleted = await Application.findOneAndDelete({ _id: id, userId: user.id });
        if (!deleted) return new Response(JSON.stringify({ error: "Application not found" }), { status: 404 });
        return new Response(JSON.stringify({ message: "Application deleted successfully" }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
