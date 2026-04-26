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
                    aria-current={location.pathname === item.href ? "page" : undefined}
                    className={cn(
                        "group relative rounded-full px-2.5 py-1.5 transition-[color,background-color] duration-150 ease-out motion-reduce:transition-none",
                        "after:absolute after:inset-x-2 after:-bottom-1 after:h-px after:origin-center after:rounded-full after:bg-luigi-gold after:shadow-[0_0_12px_rgba(234,179,8,0.35)] after:transition-transform after:duration-150 after:ease-out after:content-[''] motion-reduce:after:transition-none",
                        "hover:bg-foreground/5 hover:text-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luigi-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        location.pathname === item.href
                            ? "bg-foreground/[0.06] text-foreground after:scale-x-100"
                            : "text-foreground/60 after:scale-x-0 hover:after:scale-x-75"
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
};
