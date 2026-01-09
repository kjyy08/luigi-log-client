import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import { MessageSquare } from "lucide-react";

interface IssueHeaderProps {
    title: string;
    postId: number | string;
    createdAt: string;
    authorName: string;
    commentCount?: number;
    status?: string;
    type?: string;
    children?: React.ReactNode;
}

export const IssueHeader = ({ title, createdAt, authorName, commentCount, status = "PUBLISHED", type, children }: IssueHeaderProps) => {
    const isOpen = status === "PUBLISHED" || status === "OPEN";

    return (
        <div className="border-b pb-8 mb-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-normal text-foreground">
                    {title}
                </h1>
                <div className="flex items-center gap-2">
                    {children}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge
                    variant={isOpen ? "default" : "secondary"}
                    className={cn(
                        "rounded-full px-3 py-1 text-sm font-medium border-0 flex items-center gap-1.5",
                        isOpen ? "bg-luigi-green hover:bg-luigi-green/90 text-white" : "bg-purple-600 hover:bg-purple-600/90 text-white"
                    )}
                >
                    {isOpen ? (type === "PORTFOLIO" ? "Portfolio" : "Open") : "Closed"}
                </Badge>

                <span className="font-semibold text-foreground hover:underline cursor-pointer">
                    {authorName}
                </span>
                <span>
                    opened this issue on {new Date(createdAt).toLocaleDateString()}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {commentCount || 0} comments
                </span>
            </div>
        </div>
    );
};
