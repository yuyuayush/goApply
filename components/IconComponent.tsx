import { BookOpen, FileText, GraduationCap, Users } from "lucide-react";

const iconMap = {
    BookOpen: BookOpen,
    GraduationCap: GraduationCap,
    FileText: FileText,
    Users: Users,
};

const IconComponent = (icon: string, color: string) => {
    const Component = iconMap[icon]; // get the actual component dynamically

    if (!Component) return null; // return nothing if icon not found

    return <Component className={`h-8 w-8 ${color}`} />;
};

export default IconComponent;
