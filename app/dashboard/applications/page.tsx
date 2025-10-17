"use client"

import {useEffect, useState} from "react"
import {motion} from "framer-motion"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Progress} from "@/components/ui/progress"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    MapPin,
    Eye,
    Edit,
    Trash2
} from "lucide-react"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import axios from "axios"

const applications = [
    {
        id: 1,
        university: "University of Toronto",
        program: "Master of Science in Computer Science",
        country: "Canada",
        status: "Under Review",
        statusColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        progress: 85,
        submittedDate: "Nov 15, 2024",
        deadline: "Dec 15, 2024",
        applicationFee: "$125 CAD",
        documents: ["Transcripts", "SOP", "LORs", "Resume"],
        missingDocuments: ["English Test Score"],
        lastUpdate: "2 days ago"
    },
    {
        id: 2,
        university: "University of Melbourne",
        program: "Master of Data Science",
        country: "Australia",
        status: "Submitted",
        statusColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        progress: 100,
        submittedDate: "Oct 20, 2024",
        deadline: "Jan 31, 2025",
        applicationFee: "$100 AUD",
        documents: ["Transcripts", "SOP", "LORs", "Resume", "IELTS"],
        missingDocuments: [],
        lastUpdate: "1 week ago"
    },
    {
        id: 3,
        university: "ETH Zurich",
        program: "Master in Computer Science",
        country: "Switzerland",
        status: "Accepted",
        statusColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        progress: 100,
        submittedDate: "Sep 10, 2024",
        deadline: "Dec 15, 2024",
        applicationFee: "€150",
        documents: ["Transcripts", "SOP", "LORs", "Resume", "TOEFL"],
        missingDocuments: [],
        lastUpdate: "3 days ago"
    },
    {
        id: 4,
        university: "Imperial College London",
        program: "MSc Artificial Intelligence",
        country: "United Kingdom",
        status: "Draft",
        statusColor: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        progress: 60,
        submittedDate: "Not submitted",
        deadline: "Feb 28, 2025",
        applicationFee: "£75",
        documents: ["Transcripts", "SOP"],
        missingDocuments: ["LORs", "Resume", "English Test"],
        lastUpdate: "5 days ago"
    }
]

const getStatusIcon = (status: string) => {
    switch (status) {
        case "Accepted":
            return <CheckCircle className="w-4 h-4 text-green-600"/>
        case "Rejected":
            return <XCircle className="w-4 h-4 text-red-600"/>
        case "Under Review":
            return <Clock className="w-4 h-4 text-yellow-600"/>
        case "Submitted":
            return <FileText className="w-4 h-4 text-blue-600"/>
        default:
            return <AlertCircle className="w-4 h-4 text-gray-600"/>
    }
}

export default function ApplicationsPage() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [activeTab, setActiveTab] = useState("all")

    const filterApplications = (status: string) => {
        if (status === "all") return applications
        return applications.filter(app => app.status.toLowerCase().includes(status))
    }

    const fetchDashboardApplication = async () => {
        try {
            setLoading(true);

            const res = await axios.get("http://localhost:8080/api/dashboard/applications", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const {data} = res;
            if (data.success) {
                setApplications(data.data); // assuming backend returns { success: true, data: [...] }
            } else {
                setError("Failed to load applications");
            }

        } catch (err) {
            console.error("Error fetching dashboard overview:", err);
        } finally {
            setLoading(false);
        }
    };

    const deleteApplication = async (id: string) => {
        try {
            await axios.delete(`/api/dashboard/applications/${id}`, {
                headers: {Authorization: `Bearer ${token}`}
            })
            setApplications(applications.filter(app => app.id !== id))
        } catch (err) {
            console.error("Error deleting application:", err)
        }
    }
    //
    useEffect(() => {
        fetchDashboardApplication();
    }, []);

    return (
        <ProtectedRoute>
            <div className="flex h-screen">
                <DashboardSidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <DashboardHeader/>
                    <main className="flex-1 overflow-y-auto p-6">
                        <div className="space-y-6">
                            {/* Header */}
                            <motion.div
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.5}}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
                                        <p className="text-muted-foreground mt-1">Track and manage your university
                                            applications</p>
                                    </div>
                                    <Button className="bg-primary hover:bg-primary/90">
                                        <FileText className="w-4 h-4 mr-2"/>
                                        New Application
                                    </Button>
                                </div>
                            </motion.div>

                            {/* Stats Overview */}
                            <motion.div
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.5, delay: 0.1}}
                                className="grid grid-cols-1 md:grid-cols-4 gap-4"
                            >
                                <Card
                                    className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Total
                                                    Applications</p>
                                                <p className="text-2xl font-bold text-foreground">{applications.length}</p>
                                            </div>
                                            <FileText className="h-8 w-8 text-primary"/>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Under
                                                    Review</p>
                                                <p className="text-2xl font-bold text-foreground">
                                                    {applications.filter(app => app.status === "Under Review").length}
                                                </p>
                                            </div>
                                            <Clock className="h-8 w-8 text-yellow-600"/>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                                                <p className="text-2xl font-bold text-foreground">
                                                    {applications.filter(app => app.status === "Accepted").length}
                                                </p>
                                            </div>
                                            <CheckCircle className="h-8 w-8 text-green-600"/>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">In Draft</p>
                                                <p className="text-2xl font-bold text-foreground">
                                                    {applications.filter(app => app.status === "Draft").length}
                                                </p>
                                            </div>
                                            <AlertCircle className="h-8 w-8 text-gray-600"/>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Applications List */}
                            <motion.div
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.5, delay: 0.2}}
                            >
                                <Card
                                    className="bg-card/50 backdrop-blur border-border/50 hover:bg-card/60 transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle>Applications</CardTitle>
                                        <CardDescription>Manage your university applications</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                                            <TabsList className="grid w-full grid-cols-5">
                                                <TabsTrigger value="all">All</TabsTrigger>
                                                <TabsTrigger value="draft">Draft</TabsTrigger>
                                                <TabsTrigger value="submitted">Submitted</TabsTrigger>
                                                <TabsTrigger value="review">Under Review</TabsTrigger>
                                                <TabsTrigger value="accepted">Accepted</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value={activeTab} className="space-y-4 mt-6">
                                                {filterApplications(activeTab).map((application, index) => (
                                                    <motion.div
                                                        key={application.id}
                                                        initial={{opacity: 0, y: 20}}
                                                        animate={{opacity: 1, y: 0}}
                                                        transition={{duration: 0.3, delay: 0.1 * index}}
                                                        className="border border-border/50 rounded-lg p-6 bg-background/50 backdrop-blur"
                                                    >
                                                        <div className="flex flex-col lg:flex-row gap-6">
                                                            {/* Application Info */}
                                                            <div className="flex-1 space-y-4">
                                                                <div className="flex items-start justify-between">
                                                                    <div>
                                                                        <h3 className="text-lg font-semibold text-foreground">{application.program}</h3>
                                                                        <p className="text-muted-foreground">{application.university}</p>
                                                                        <div
                                                                            className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                                                            <MapPin className="w-3 h-3"/>
                                                                            {application.country}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        {getStatusIcon(application.status)}
                                                                        <Badge className={application.statusColor}>
                                                                            {application.status}
                                                                        </Badge>
                                                                    </div>
                                                                </div>

                                                                {/* Progress */}
                                                                <div className="space-y-2">
                                                                    <div
                                                                        className="flex items-center justify-between text-sm">
                                                                        <span className="text-muted-foreground">Application Progress</span>
                                                                        <span
                                                                            className="text-foreground font-medium">{application.progress}%</span>
                                                                    </div>
                                                                    <Progress value={application.progress}
                                                                              className="h-2"/>
                                                                </div>

                                                                {/* Documents */}
                                                                <div className="space-y-2">
                                                                    <p className="text-sm font-medium text-foreground">Documents:</p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {application.documents.map((doc) => (
                                                                            <Badge key={doc} variant="secondary"
                                                                                   className="text-xs">
                                                                                {doc}
                                                                            </Badge>
                                                                        ))}
                                                                        {application.missingDocuments.map((doc) => (
                                                                            <Badge key={doc} variant="destructive"
                                                                                   className="text-xs">
                                                                                {doc} (Missing)
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {/* Application Details */}
                                                                <div
                                                                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                                    <div>
                                                                        <p className="text-muted-foreground">Submitted</p>
                                                                        <p className="font-medium text-foreground">{application.submittedDate}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-muted-foreground">Deadline</p>
                                                                        <p className="font-medium text-foreground">{application.deadline}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-muted-foreground">Application
                                                                            Fee</p>
                                                                        <p className="font-medium text-foreground">{application.applicationFee}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-muted-foreground">Last
                                                                            Update</p>
                                                                        <p className="font-medium text-foreground">{application.lastUpdate}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex lg:flex-col gap-2">
                                                                <Button variant="outline" size="sm"
                                                                        className="bg-background/50 backdrop-blur border-border/50">
                                                                    <Eye className="w-4 h-4 mr-2"/>
                                                                    View
                                                                </Button>
                                                                <Button variant="outline" size="sm"
                                                                        className="bg-background/50 backdrop-blur border-border/50">
                                                                    <Edit className="w-4 h-4 mr-2"/>
                                                                    Edit
                                                                </Button>
                                                                <Button onClick={() => deleteApplication(1)}
                                                                        variant="outline" size="sm"
                                                                        className="bg-background/50 backdrop-blur border-border/50 text-destructive hover:text-destructive">
                                                                    <Trash2 className="w-4 h-4 mr-2"/>
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}