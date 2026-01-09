import { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";
import { MarkdownView } from "@/shared/ui/markdown-view";

interface CommentBoxProps extends ComponentProps<"div"> {
    author: {
        name: string;
        avatarUrl?: string;
    };
    date: string;
    content: string;
    type?: "ISSUE" | "COMMENT";
}

export const CommentBox = ({ author, date, content, type = "ISSUE", className, ...props }: CommentBoxProps) => {
    return (
        <div className={cn("flex gap-4", className)} {...props}>
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
                <div className="border rounded-md bg-background shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b text-sm">
                        <span className="font-semibold text-foreground hover:underline cursor-pointer">
                            {author.name}
                        </span>
                        <span className="text-muted-foreground">
                            commented on {new Date(date).toLocaleDateString()}
                        </span>
                        <div className="ml-auto flex items-center gap-2">
                            {/* Actions like Edit/Delete could be injected here */}
                            <span className="px-2 py-0.5 rounded-full border text-xs text-muted-foreground bg-background">
                                {type === "ISSUE" ? "Author" : "Maintainer"}
                            </span>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 md:p-8 bg-background min-h-[200px]">
                        <MarkdownView content={content} />
                    </div>
                </div>
            </div>
        </div>
    );
};
