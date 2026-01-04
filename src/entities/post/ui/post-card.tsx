import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Trash2, Pencil } from "lucide-react";
import type { PostResponse } from "../model/post.dto";

interface PostCardProps {
    post: PostResponse;
    isAuthenticated?: boolean;
    onDelete?: (e: React.MouseEvent, postId: string) => void;
    className?: string;
}

export const PostCard = ({ post, isAuthenticated, onDelete, className }: PostCardProps) => {
    return (
        <Link
            to={`/posts/${post.author.username}/${post.slug}`}
            className={cn(
                "group flex flex-col gap-4 rounded-2xl border p-5 transition-all hover:bg-muted/50 hover:shadow-lg hover:-translate-y-1",
                className
            )}
        >
            {/* Thumbnail Placeholder */}
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted/50 border border-border/50 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-luigi-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {post.thumbnail ? (
                    <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground/30 font-bold text-4xl select-none">
                        LOG
                    </div>
                )}

                {/* Content Type Badge */}
                <div className={cn(
                    "absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm",
                    post.type === "PORTFOLIO"
                        ? "bg-luigi-blue text-white"
                        : "bg-luigi-green text-white"
                )}>
                    {post.type}
                </div>

                {isAuthenticated && (
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                            to={`/posts/${post.postId}/edit`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button variant="secondary" size="icon" className="h-8 w-8">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => onDelete?.(e, post.postId)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={cn(
                        "font-semibold",
                        post.type === "PORTFOLIO" ? "text-luigi-blue" : "text-luigi-green"
                    )}>
                        {post.type === "PORTFOLIO" ? "Portfolio" : "Tech"}
                    </span>
                    <span className="opacity-30">|</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold leading-tight group-hover:text-luigi-green transition-colors">
                    {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {(post.body || "").replace(/[#*`]/g, "")}
                </p>
            </div>

            <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {post.tags && post.tags.length > 0 ? (
                    post.tags.map(tag => (
                        <span
                            key={tag}
                            className="inline-flex items-center rounded-md bg-secondary/50 border border-border px-2 py-0.5 text-[11px] font-medium text-secondary-foreground transition-colors group-hover:border-luigi-green/30"
                        >
                            #{tag}
                        </span>
                    ))
                ) : (
                    <span className="text-[11px] text-muted-foreground opacity-50 italic">No tags</span>
                )}
            </div>
        </Link>
    );
};
