import { Card, CardHeader, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Eye, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { postQueries } from "@/entities/post/model/post.queries";

import { RecentPostListSkeleton } from "./recent-post-list-skeleton";

export const RecentPostList = () => {
    const { data, isLoading } = useQuery(postQueries.list({ size: 6, status: 'PUBLISHED' })); // Fetch restricted to 6
    const navigate = useNavigate();

    if (isLoading) {
        return <RecentPostListSkeleton />;
    }

    // Fallback if data is undefined
    const posts = data?.posts || [];

    return (
        <div className="space-y-4">
            <h2 className="text-base font-semibold">Recent Posts</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {posts.slice(0, 6).map((post) => {
                    return (
                        <Card
                            key={post.postId}
                            className="bg-background border-border hover:border-luigi-green transition-colors cursor-pointer group flex flex-col h-[130px] shadow-sm relative"
                            onClick={() => navigate(`/posts/${post.author.username}/${post.slug}`)}
                        >
                            <CardHeader className="pb-1 pt-3 px-4">
                                <div className="flex items-start justify-between gap-2">
                                    <span className="text-sm font-bold text-luigi-blue group-hover:underline truncate pr-16">
                                        {post.title}
                                    </span>
                                    {/* Metadata positioned top-right */}
                                    <div className="absolute top-3 right-4 flex items-center gap-3 text-xs text-muted-foreground bg-background/80 pl-2">
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            <span>{post.viewCount || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="w-3 h-3" />
                                            <span>{post.commentCount || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="px-4 pb-3 pt-0 flex-1 flex flex-col justify-between">
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                    {post.description || (post.body ? post.body.slice(0, 80) : '')}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2">
                                        {post.tags && post.tags.slice(0, 2).map(tag => (
                                            <Badge key={tag} variant="secondary" className="h-5 px-1.5 text-[10px] font-normal text-muted-foreground bg-muted hover:bg-muted-foreground/20">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <span className="text-[10px] opacity-80 text-muted-foreground">
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            <Button
                variant="ghost"
                className="w-full text-xs text-muted-foreground hover:text-luigi-green font-semibold"
                onClick={() => navigate('/blog')}
            >
                SHOW MORE
            </Button>
        </div>
    );
};
