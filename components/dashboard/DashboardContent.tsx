"use client"

import {motion} from "framer-motion"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {useAuth} from "@/contexts/AuthContext"
import {Button} from "@/components/ui/button"
import {Progress} from "@/components/ui/progress"
import {Badge} from "@/components/ui/badge"

import axios from "axios"
import {
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    GraduationCap,
    MapPin,
    Star,
    TrendingUp,
    Users,
    ArrowRight,
    AlertCircle
} from "lucide-react"
import {useEffect, useState} from "react";
import IconComponent from "@/components/IconComponent";

const iconMap = {
    BookOpen: BookOpen,
    GraduationCap: GraduationCap,
    FileText: FileText,
    Users: Users,
};

export default function DashboardContent() {
    const {user} = useAuth()
    const [stats, setStats] = useState<any>([]);
    const [recentApplications, setRecentApplications] = useState<any>([]);
    const [upcomingDeadlines, setUpcomingDeadlines] = useState<any>([]);
    const [recommendedPrograms, setRecommendedPrograms] = useState<any>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/dashboard/overview", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // if using JWT
                    },
                });

                const data = response.data;

                setStats(data.stats || []);
                setRecentApplications(data.recentApplications || []);
                setUpcomingDeadlines(data.upcomingDeadlines || []);
                setRecommendedPrograms(data.recommendedPrograms || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching overview:", err);
                setLoading(false);
            }
        };

        fetchOverview();
    }, []);


    const getUserDisplayName = () => {
        if (user?.firstName) {
            return user.firstName
        }
        return user?.email?.split('@')[0] || 'User'
    }

    return (
        <div className="p-6 space-y-6">
            {/* Welcome Section */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Welcome back, {getUserDisplayName()}! 👋</h1>
                        <p className="text-muted-foreground mt-1">Here's what's happening with your applications</p>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90">
                        <BookOpen className="w-4 h-4 mr-2"/>
                        New Application
                    </Button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.1}}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {stats.map((stat: any, index: any) => (
                    <Card key={index} className="bg-card/50 backdrop-blur border-border/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                                </div>
                                {IconComponent(stat.icon, stat.color)}


                            </div>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Applications */}
                <motion.div
                    initial={{opacity: 0, x: -20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.5, delay: 0.2}}
                >
                    <Card className="bg-card/50 backdrop-blur border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent Applications</CardTitle>
                                <CardDescription>Track your application progress</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm">
                                View All
                                <ArrowRight className="w-4 h-4 ml-2"/>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentApplications.map((app: any) => (
                                <div key={app.id} className="p-4 rounded-lg border border-border/50 bg-background/50">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-foreground">{app.university}</h4>
                                            <p className="text-sm text-muted-foreground">{app.program}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <MapPin className="w-3 h-3 text-muted-foreground"/>
                                                <span className="text-xs text-muted-foreground">{app.country}</span>
                                            </div>
                                        </div>
                                        <Badge className={app.statusColor}>{app.status}</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="text-foreground font-medium">{app.progress}%</span>
                                        </div>
                                        <Progress value={app.progress} className="h-2"/>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">Deadline: {app.deadline}</span>
                                            <Button variant="link" className="h-auto p-0 text-xs">
                                                Continue
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Upcoming Deadlines */}
                <motion.div
                    initial={{opacity: 0, x: 20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.5, delay: 0.3}}
                >
                    <Card className="bg-card/50 backdrop-blur border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Upcoming Deadlines</CardTitle>
                                <CardDescription>Don't miss important dates</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm">
                                <Calendar className="w-4 h-4"/>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {upcomingDeadlines.map((deadline: any) => (
                                <div key={deadline.id}
                                     className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-background/50">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${
                                        deadline.priority === 'high' ? 'bg-red-500' :
                                            deadline.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}/>
                                    <div className="flex-1">
                                        <h5 className="font-medium text-foreground text-sm">{deadline.task}</h5>
                                        <p className="text-xs text-muted-foreground">{deadline.university}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Clock className="w-3 h-3 text-muted-foreground"/>
                                            <span className="text-xs text-muted-foreground">{deadline.deadline}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <CheckCircle className="w-4 h-4"/>
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full mt-4">
                                <AlertCircle className="w-4 h-4 mr-2"/>
                                View All Deadlines
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recommended Programs */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.4}}
            >
                <Card className="bg-card/50 backdrop-blur border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recommended Programs</CardTitle>
                            <CardDescription>Programs that match your profile</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm">
                            View All
                            <ArrowRight className="w-4 h-4 ml-2"/>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recommendedPrograms.map((program: any) => (
                                <div key={program.id}
                                     className="p-4 rounded-lg border border-border/50 bg-background/50">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-foreground text-sm">{program.university}</h4>
                                                <Badge variant="secondary" className="text-xs">{program.ranking}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{program.program}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <MapPin className="w-3 h-3 text-muted-foreground"/>
                                                <span className="text-xs text-muted-foreground">{program.country}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-primary fill-current"/>
                                                <span className="text-sm font-medium text-primary">{program.match}% match</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-foreground">{program.tuition}</span>
                                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                                            Apply Now
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.5}}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="p-6 text-center">
                        <BookOpen className="w-8 h-8 text-primary mx-auto mb-3"/>
                        <h3 className="font-semibold text-foreground mb-2">Find Programs</h3>
                        <p className="text-sm text-muted-foreground mb-4">Discover programs that match your
                            interests</p>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                            Explore Programs
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                    <CardContent className="p-6 text-center">
                        <FileText className="w-8 h-8 text-green-600 mx-auto mb-3"/>
                        <h3 className="font-semibold text-foreground mb-2">Upload Documents</h3>
                        <p className="text-sm text-muted-foreground mb-4">Keep your documents organized and ready</p>
                        <Button variant="outline" className="w-full border-green-500/20 hover:bg-green-500/5">
                            Manage Documents
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                    <CardContent className="p-6 text-center">
                        <Users className="w-8 h-8 text-blue-600 mx-auto mb-3"/>
                        <h3 className="font-semibold text-foreground mb-2">Get Mentorship</h3>
                        <p className="text-sm text-muted-foreground mb-4">Connect with experts and students</p>
                        <Button variant="outline" className="w-full border-blue-500/20 hover:bg-blue-500/5">
                            Find Mentors
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}