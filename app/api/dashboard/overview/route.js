import dbConnect from "@/lib/mongodb";
import Application from "@/model/Application";
import {getUserFromToken} from "../../../../lib/auth";
import { BookOpen, GraduationCap, FileText, Users } from "lucide-react";

/**
 * @swagger
 * /api/dashboard/overview:
 *   get:
 *     summary: Returns dashboard stats, recent applications, deadlines, and recommended programs
 *     tags:
 *       - Dashboard
 *     responses:
 *       200:
 *         description: Dashboard overview data
 *       401:
 *         description: Unauthorized
 */
export async function GET(req) {
    try {
        await dbConnect();

        // Get the user from token
        const user = await getUserFromToken(req);
        if (!user) return new Response(JSON.stringify({error: "Unauthorized"}), {status: 401});

        // Fetch recent applications
        const applications = await Application.find({userId: user.id})
            .sort({updatedAt: -1})
            .limit(5);

        // Compute stats

        const stats = [
            {
                title: "Applications Submitted",
                value: "12",
                change: "+3 this month",
                icon: BookOpen,
                color: "text-blue-600"
            },
            {
                title: "Universities Applied",
                value: "8",
                change: "+2 this month",
                icon: GraduationCap,
                color: "text-primary"
            },
            {
                title: "Documents Uploaded",
                value: "15",
                change: "All complete",
                icon: FileText,
                color: "text-green-600"
            },
            {
                title: "Profile Completion",
                value: "95%",
                change: "Almost done!",
                icon: Users,
                color: "text-orange-600"
            }
        ]

        const recentApplications = [
            {
                id: 1,
                university: "University of Toronto",
                program: "Computer Science - Masters",
                country: "Canada",
                status: "Under Review",
                statusColor: "bg-yellow-100 text-yellow-800",
                deadline: "Dec 15, 2024",
                progress: 85
            },
            {
                id: 2,
                university: "University of Melbourne",
                program: "Data Science - Masters",
                country: "Australia",
                status: "Submitted",
                statusColor: "bg-blue-100 text-blue-800",
                deadline: "Jan 31, 2025",
                progress: 100
            },
            {
                id: 3,
                university: "Imperial College London",
                program: "Artificial Intelligence - MSc",
                country: "United Kingdom",
                status: "Draft",
                statusColor: "bg-gray-100 text-gray-800",
                deadline: "Feb 28, 2025",
                progress: 60
            }
        ]

        const upcomingDeadlines = [
            {
                id: 1,
                task: "Submit recommendation letters",
                university: "University of Toronto",
                deadline: "Dec 10, 2024",
                priority: "high"
            },
            {
                id: 2,
                task: "Complete English proficiency test",
                university: "University of Sydney",
                deadline: "Dec 20, 2024",
                priority: "medium"
            },
            {
                id: 3,
                task: "Upload transcripts",
                university: "McGill University",
                deadline: "Jan 5, 2025",
                priority: "low"
            }
        ]

        const recommendedPrograms = [
            {
                id: 1,
                university: "Stanford University",
                program: "Master of Science in Computer Science",
                country: "United States",
                ranking: "#2 Global",
                match: 92,
                tuition: "$58,416/year"
            },
            {
                id: 2,
                university: "ETH Zurich",
                program: "Master in Data Science",
                country: "Switzerland",
                ranking: "#7 Global",
                match: 88,
                tuition: "$1,460/year"
            }
        ]
        // Return JSON response
        return new Response(JSON.stringify({stats, recentApplications,upcomingDeadlines, recommendedPrograms}), {
            status: 200, headers: {"Content-Type": "application/json"},
        });
    } catch (err) {
        console.error("Dashboard GET error:", err);
        return new Response(JSON.stringify({error: err.message || "Internal Server Error"}), {
            status: 500, headers: {"Content-Type": "application/json"},
        });
    }
}