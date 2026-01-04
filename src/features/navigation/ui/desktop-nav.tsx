import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { NAV_ITEMS } from "../config/navigation-items";

export const DesktopNav = () => {
    const location = useLocation();

    return (
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {NAV_ITEMS.map((item) => (
                <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        location.pathname === item.href ? "text-foreground" : "text-foreground/60"
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
};
