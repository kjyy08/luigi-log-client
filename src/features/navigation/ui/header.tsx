import type { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { MobileMenu } from "./mobile-menu";
import { Input } from "@/shared/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

interface HeaderProps {
    rightActions?: ReactNode;
}

export const Header = ({ rightActions }: HeaderProps) => {
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
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center gap-4">
                {/* Logo */}
                <Link to="/" className="mr-6 flex items-center gap-2 font-bold text-xl text-foreground">
                    <span className="text-luigi-green">Luigi</span>
                    <span className="text-luigi-blue">Log</span>
                </Link>

                {/* Navigation Tabs (Merged) */}
                <div className="hidden md:flex">
                    <Tabs defaultValue="overview" value={getTabValue()} onValueChange={handleValueChange} className="w-auto border-none">
                        <TabsList className="h-auto bg-transparent p-0 gap-4">
                            <TabsTrigger
                                value="overview"
                                className="bg-transparent h-16 rounded-none border-b-2 border-transparent px-4 py-2 font-medium text-muted-foreground data-[state=active]:border-luigi-gold data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground"
                            >
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="posts"
                                className="bg-transparent h-16 rounded-none border-b-2 border-transparent px-4 py-2 font-medium text-muted-foreground data-[state=active]:border-luigi-gold data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground"
                            >
                                Posts
                            </TabsTrigger>
                            <TabsTrigger
                                value="portfolio"
                                className="bg-transparent h-16 rounded-none border-b-2 border-transparent px-4 py-2 font-medium text-muted-foreground data-[state=active]:border-luigi-gold data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground"
                            >
                                Portfolio
                            </TabsTrigger>
                            <TabsTrigger
                                value="guestbook"
                                className="bg-transparent h-16 rounded-none border-b-2 border-transparent px-4 py-2 font-medium text-muted-foreground data-[state=active]:border-luigi-gold data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground"
                            >
                                Guestbook
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Search */}
                <div className="hidden md:flex items-center w-full max-w-xs mr-4">
                    <div className="relative w-full">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Type / to search" className="pl-8 h-9 bg-muted/50 border-none focus-visible:ring-1" />
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    {rightActions}
                    <MobileMenu />
                </div>
            </div>
        </header>
    );
};
