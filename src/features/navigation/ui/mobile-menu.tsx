import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { NAV_ITEMS } from "../config/navigation-items";

export const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <nav className="flex flex-col gap-4 mt-8">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-medium hover:text-luigi-green"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
};
