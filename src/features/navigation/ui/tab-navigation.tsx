import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { useNavigate, useLocation } from "react-router-dom"
import { cn } from "@/shared/lib/utils"
// import { BookOpen, FolderGit2, Layton, Book } from "lucide-react" // Icons if needed

export const TabNavigation = ({ className }: { className?: string }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Mapping routes to tab values
    const getTabValue = () => {
        const path = location.pathname;
        if (path === "/" || path === "") return "overview";
        if (path.startsWith("/blog")) return "posts";
        if (path.startsWith("/portfolio")) return "portfolio";
        if (path.startsWith("/guestbook")) return "guestbook";
        return "overview";
    };

    const handleValueChange = (value: string) => {
        switch (value) {
            case "overview":
                navigate("/");
                break;
            case "posts":
                navigate("/blog");
                break;
            case "portfolio":
                navigate("/portfolio");
                break;
            case "guestbook":
                navigate("/guestbook");
                break;
            default:
                break;
        }
    };

    return (
        <div className={cn("w-full border-b bg-muted/30 pt-4", className)}>
            <div className="container">
                <Tabs defaultValue="overview" value={getTabValue()} onValueChange={handleValueChange} className="w-full">
                    <TabsList className="h-auto w-full justify-start gap-2 bg-transparent p-0 overflow-x-auto">
                        <TabsTrigger value="overview" className="gap-2">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="posts" className="gap-2">
                            Posts
                        </TabsTrigger>
                        <TabsTrigger value="portfolio" className="gap-2">
                            Portfolio
                        </TabsTrigger>
                        <TabsTrigger value="guestbook" className="gap-2">
                            Guestbook
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    );
};
