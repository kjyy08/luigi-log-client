import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { postQueries } from "@/entities/post/model/post.queries";
import { useDeletePost } from "@/entities/post/model/post.mutations";
import { Button } from "@/shared/ui/button";

import { useIsOwner } from "@/shared/hooks/use-is-owner";
import { useToast } from "@/shared/hooks/use-toast";
import { IssueHeader } from "./issue-header";
import { CommentBox } from "./comment-box";
import { PostDetailSidebar } from "./post-detail-sidebar";
import { PostDetailSkeleton } from "./post-detail-skeleton";

export const PostDetailPage = () => {
    const { username, slug } = useParams<{ username: string; slug: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const isOwner = useIsOwner();

    const { mutateAsync: deletePost } = useDeletePost();

    const { data: post, isLoading, isError } = useQuery({
        ...postQueries.detailBySlug(username!, slug!),
        enabled: !!username && !!slug,
    });


    const handleDelete = async () => {
        if (!post) return;
        if (confirm("정말로 이 글을 삭제하시겠습니까?")) {
            try {
                await deletePost(post.postId);
                toast({ title: "삭제 완료", description: "포스트가 삭제되었습니다." });
                navigate(post.type === "PORTFOLIO" ? "/portfolio" : "/blog");
            } catch (error) {
                toast({ title: "삭제 실패", description: "오류가 발생했습니다.", variant: "destructive" });
            }
        }
    };

    if (isLoading) return <PostDetailSkeleton />;
    if (isError || !post) return <div className="container py-20 text-center text-muted-foreground">Post not found.</div>;

    // Moved to top
    // const isOwner = useIsOwner();

    return (
        <article className="container max-w-7xl py-8 animate-fade-in">
            <IssueHeader
                title={post.title}
                postId={post.postId}
                createdAt={post.createdAt}
                authorName={post.author?.nickname || "Anonymous"}
                status={post.status || "PUBLISHED"} // Add status field if API supports it
                type={post.type}
            >
                {isOwner && (
                    <>
                        <Button variant="secondary" size="sm" asChild>
                            <Link to={`/posts/${post.postId}/edit`}>
                                Edit
                            </Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            Delete
                        </Button>
                    </>
                )}
            </IssueHeader>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                <div className="space-y-8 min-w-0">
                    <CommentBox
                        author={{
                            name: post.author?.nickname || "Anonymous",
                            avatarUrl: post.author?.profileImageUrl
                        }}
                        date={post.createdAt}
                        content={post.body}
                        type="ISSUE"
                    />

                    <div className="relative py-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t-2 border-dashed border-gray-200 dark:border-gray-800" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-background px-4 text-xs uppercase text-muted-foreground font-medium">
                                Timeline
                            </span>
                        </div>
                    </div>

                    {/* Placeholder for comments */}
                    <div className="text-center text-muted-foreground py-8 border rounded-lg border-dashed bg-muted/20">
                        No comments yet
                    </div>
                </div>

                <PostDetailSidebar
                    author={{
                        nickname: post.author?.nickname || "Anonymous",
                        profileImageUrl: post.author?.profileImageUrl
                    }}
                    tags={post.tags}
                    type={post.type}
                />
            </div>
        </article>
    );
};
