import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export const FilterBar = () => {
    return (
        <div className="flex flex-col md:flex-row gap-4 py-4 border-b border-border mb-6">
            <div className="relative flex-1">
                <Input
                    placeholder="Search posts..."
                    className="pl-3 pr-4 h-9 w-full bg-background border-border focus-visible:ring-luigi-green transition-all"
                />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 gap-1 font-normal text-muted-foreground border-border hover:text-foreground">
                            Sort
                            <ChevronDown className="w-3 h-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Newest</DropdownMenuItem>
                        <DropdownMenuItem>Name</DropdownMenuItem>
                        <DropdownMenuItem>Popularity</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
