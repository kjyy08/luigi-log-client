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
                    placeholder="게시글 검색..."
                    className="pl-3 pr-4 h-9 w-full bg-background border-border focus-visible:ring-luigi-green transition-all"
                />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 gap-1 font-normal text-muted-foreground border-border hover:text-foreground">
                            정렬
                            <ChevronDown className="w-3 h-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>최신순</DropdownMenuItem>
                        <DropdownMenuItem>이름순</DropdownMenuItem>
                        <DropdownMenuItem>인기순</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
