import { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";
import { MarkdownView } from "@/shared/ui/markdown-view";
import type { MarkdownHeading } from "../model/reading-navigation";

interface CommentBoxProps extends ComponentProps<"div"> {
    author: {
        name: string;
        avatarUrl?: string;
    };
    date: string;
    content: string;
    type?: "ISSUE" | "COMMENT";
    actions?: React.ReactNode;
    headingIds?: string[];
    headings?: MarkdownHeading[];
}

export const CommentBox = ({ author, date, content, type = "ISSUE", actions, headingIds, headings, className, ...props }: CommentBoxProps) => {
    return (
        <div className={cn("flex gap-0 md:gap-4", className)} {...props}>
            <div className="hidden md:block flex-none">
                <div className="w-10 h-10 rounded-full border bg-muted overflow-hidden">
                    {author.avatarUrl ? (
                        <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                            {author.name.slice(0, 2).toUpperCase()}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="overflow-hidden border-y bg-background shadow-none sm:rounded-md sm:border sm:shadow-sm">
                    {/* Header */}
                    <div className="flex items-center gap-2 border-b bg-muted/40 px-3 py-3 text-sm sm:px-4">
                        <span className="font-semibold text-foreground hover:underline cursor-pointer">
                            {author.name}
                        </span>
                        <span className="text-muted-foreground">
                            commented on {new Date(date).toLocaleDateString()}
                        </span>
                        <div className="ml-auto flex items-center gap-2">
                            {type === "ISSUE" && (
                                <span className="px-2 py-0.5 rounded-full border text-xs text-muted-foreground bg-background">
                                    Author
                                </span>
                            )}
                            {actions}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="min-h-[200px] bg-background p-3 sm:p-4 md:p-8">
                        <MarkdownView content={content} headingIds={headingIds} headings={headings} />
                    </div>
                </div>
            </div>
        </div>
    );
};
