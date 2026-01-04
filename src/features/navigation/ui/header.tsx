import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { DesktopNav } from "./desktop-nav";
import { MobileMenu } from "./mobile-menu";

interface HeaderProps {
    rightActions?: ReactNode;
}

export const Header = ({ rightActions }: HeaderProps) => {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
                        <span className="text-luigi-green">Luigi</span>
                        <span className="text-luigi-blue">Log</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <DesktopNav />

                {/* Right Side Actions */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    {rightActions}
                    <MobileMenu />
                </div>
            </div>
        </header>
    );
};
