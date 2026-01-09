import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postQueries, type PostType, PostCard, useDeletePost, PostListItem } from "@/entities/post";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface PostListProps {
    fixedType?: PostType;
    showTabs?: boolean;
    viewMode?: "grid" | "list";
}

const TABS = [
    { label: "All", value: "all" },
    { label: "Tech", value: "BLOG" },
    { label: "Portfolio", value: "PORTFOLIO" },
] as const;

export const PostList = ({ fixedType, showTabs = true, viewMode = "grid" }: PostListProps) => {
    const [activeTab, setActiveTab] = useState<string>(fixedType ?? "all");

    // If fixedType is provided, it takes precedence. Otherwise use activeTab.
    const typeFilter = fixedType ?? (activeTab === "all" ? undefined : (activeTab as PostType));

    const { data } = useSuspenseQuery(postQueries.list({
        type: typeFilter,
        status: "PUBLISHED"
    }));

    const { isAuthenticated } = useAuthStore();
    const { mutateAsync: deletePost } = useDeletePost();

    const handleDelete = async (e: React.MouseEvent, postId: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm("정말로 삭제하시겠습니까?")) {
            try {
                await deletePost(postId);
            } catch (error) {
                console.error("Delete failed", error);
                alert("삭제 실패");
            }
        }
    };

    const posts = data?.posts ?? [];

    return (
        <div className="space-y-6">
            {showTabs && !fixedType && (
                <div className="flex items-center gap-2">
                    {TABS.map((tab) => (
                        <Button
                            key={tab.value}
                            variant={activeTab === tab.value ? "default" : "ghost"}
                            onClick={() => setActiveTab(tab.value)}
                            className={cn(
                                "rounded-full px-6",
                                activeTab === tab.value
                                    ? "bg-foreground text-background hover:bg-foreground/90"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>
            )}

            <div className={cn(
                "grid gap-8",
                viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 gap-0"
            )}>
                {posts.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-muted-foreground">
                        작성된 글이 없습니다.
                    </div>
                ) : (
                    posts.map((post) => (
                        viewMode === "list" ? (
                            <PostListItem
                                key={post.postId}
                                post={post}
                            />
                        ) : (
                            <PostCard
                                key={post.postId}
                                post={post}
                                isAuthenticated={isAuthenticated}
                                onDelete={handleDelete}
                            />
                        )
                    ))
                )}
            </div>
        </div>
    );
};
