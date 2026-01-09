import { Badge } from "@/shared/ui/badge";
import { Link } from "react-router-dom";
import { PostResponse } from "../model/post.dto";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Star } from "lucide-react";

interface PostListItemProps {
    post: PostResponse;
    showTopics?: boolean;
}

export const PostListItem = ({ post, showTopics = true }: PostListItemProps) => {
    return (
        <div className="flex flex-col gap-2 py-6 border-b border-border last:border-0 hover:bg-muted/30 transition-colors px-2 -mx-2 rounded-md">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                    <Link
                        to={`/posts/${post.author?.username || 'anonymous'}/${post.slug}`}
                        className="text-xl font-bold text-luigi-blue hover:underline hover:text-luigi-green transition-colors truncate"
                    >
                        {post.title}
                    </Link>
                    <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-border rounded-full px-2 py-0.5 whitespace-nowrap">
                        Public
                    </Badge>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
                    <Star className="w-4 h-4" />
                    <span>0</span>
                </div>
            </div>

            <p className="text-muted-foreground text-sm line-clamp-2 max-w-3xl">
                {post.description || "No description provided."}
            </p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1 flex-wrap">
                {showTopics && post.tags && post.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                        {post.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-luigi-blue/10 text-luigi-blue hover:bg-luigi-blue/20 rounded-full border-none">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-1">
                    <span>Updated {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}</span>
                </div>
            </div>
        </div>
    );
};
