import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostList, getPostDetail } from "@/entities/post/api/post.api";
import { useDeletePost } from "@/entities/post/model/post.mutations";
import { Button } from "@/shared/ui/button";
import { ArrowLeft, Calendar, Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { useToast } from "@/shared/hooks/use-toast";
import { MarkdownView } from "@/shared/ui/markdown-view";
import { cn } from "@/shared/lib/utils";

export const PostDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { isAuthenticated } = useAuthStore();
    const { mutateAsync: deletePost } = useDeletePost();

    const { data: post, isLoading, isError } = useQuery({
        queryKey: ["post", "detail", slug],
        queryFn: async () => {
            try {
                const detail = await getPostDetail(slug!);
                if (detail) return detail;
            } catch (e) {
                // Ignore and try searching in list
            }

            const result = await getPostList({ status: "PUBLISHED" });
            const found = result.posts.find(p => p.slug === slug);

            if (found) {
                return await getPostDetail(found.postId);
            }

            throw new Error("Post not found");
        },
        enabled: !!slug,
    });

    const handleDelete = async () => {
        if (!post) return;
        if (confirm("정말로 이 글을 삭제하시겠습니까?")) {
            try {
                await deletePost(post.postId);
                toast({ title: "삭제 완료", description: "포스트가 삭제되었습니다." });
                navigate("/posts");
            } catch (error) {
                toast({ title: "삭제 실패", description: "오류가 발생했습니다.", variant: "destructive" });
            }
        }
    };

    if (isLoading) return <div className="container py-20 text-center text-muted-foreground">Loading post...</div>;
    if (isError || !post) return <div className="container py-20 text-center text-muted-foreground">Post not found.</div>;

    return (
        <article className="container max-w-3xl py-12 animate-fade-in space-y-8">
            <div className="flex items-center justify-between gap-4">
                <Button variant="ghost" onClick={() => navigate("/posts")} className="-ml-4 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    목록으로
                </Button>

                {isAuthenticated && (
                    <div className="flex gap-2">
                        <Button variant="secondary" size="icon" asChild title="수정">
                            <Link to={`/posts/${post.postId}/edit`}>
                                <Pencil className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="destructive" size="icon" onClick={handleDelete} title="삭제">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            <header className="space-y-6">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                    <span className={cn(
                        post.type === "PORTFOLIO" ? "text-luigi-blue" : "text-luigi-green"
                    )}>
                        {post.type}
                    </span>
                    <span className="opacity-30">|</span>
                    <div className="flex items-center text-muted-foreground font-normal">
                        <Calendar className="mr-1 h-3.5 w-3.5" />
                        {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                    {post.title}
                </h1>

                <div className="flex items-center gap-4 py-2 border-y">
                    <div className="w-10 h-10 rounded-full border p-0.5 overflow-hidden">
                        {post.author?.profileImageUrl ? (
                            <img src={post.author.profileImageUrl} alt={post.author.nickname} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-muted rounded-full flex items-center justify-center text-[10px] text-muted-foreground">
                                NM
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-sm text-foreground">{post.author?.nickname || "Anonymous"}</p>
                        <p className="text-xs text-muted-foreground">Author</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-secondary text-xs font-medium">
                            #{tag}
                        </span>
                    ))}
                </div>

                {post.thumbnail && (
                    <div className="aspect-video w-full overflow-hidden rounded-3xl border shadow-xl">
                        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                )}
            </header>

            <section>
                <MarkdownView content={post.body} />
            </section>

        </article>
    );
};
