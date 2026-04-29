import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeletePost } from "@/entities/post/model/post.mutations";
import { postQueries } from "@/entities/post/model/post.queries";
import { useIsOwner } from "@/shared/hooks/use-is-owner";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";
import { CommentBox } from "./comment-box";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { IssueHeader } from "./issue-header";
import { PostDetailSidebar } from "./post-detail-sidebar";
import { PostDetailSkeleton } from "./post-detail-skeleton";
import { ReadingHud, ReadingProgress } from "./reading-hud";
import { extractMarkdownHeadings } from "../model/reading-navigation";

export const PostDetailPage = () => {
	const { username, slug } = useParams<{ username: string; slug: string }>();
	const navigate = useNavigate();
	const { toast } = useToast();
	const isOwner = useIsOwner();

	const { mutateAsync: deletePost } = useDeletePost();

	const {
		data: post,
		isLoading,
		isError,
	} = useQuery({
		...postQueries.detailBySlug(username ?? "", slug ?? ""),
		enabled: !!username && !!slug,
	});

	const content = post?.body ?? "";
	const headings = useMemo(() => extractMarkdownHeadings(content), [content]);
	const headingIds = useMemo(() => headings.map((heading) => heading.id), [headings]);

	const handleDelete = async () => {
		if (!post) return;
		if (confirm("Are you sure you want to delete this post?")) {
			try {
				await deletePost(post.postId);
				toast({ title: "Deleted", description: "Post has been deleted." });
				navigate(post.type === "PORTFOLIO" ? "/portfolio" : "/blog");
			} catch (_error) {
				toast({
					title: "Error",
					description: "Failed to delete post.",
					variant: "destructive",
				});
			}
		}
	};

	if (isLoading) return <PostDetailSkeleton />;
	if (isError || !post)
		return (
			<div className="container py-20 text-center text-muted-foreground">
				Post not found.
			</div>
		);

	return (
		<>
			<ReadingProgress />
			<article className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
			<IssueHeader
				title={post.title}
				postId={post.postId}
				createdAt={post.createdAt}
				authorName={post.author?.nickname || "Anonymous"}
				viewCount={post.viewCount}
				commentCount={post.commentCount}
				status={post.status || "PUBLISHED"} // Add status field if API supports it
				type={post.type}
			>
				{isOwner && (
					<>
						<Button variant="secondary" size="sm" asChild>
							<Link to={`/posts/${post.postId}/edit`}>Edit</Link>
						</Button>
						<Button variant="destructive" size="sm" onClick={handleDelete}>
							Delete
						</Button>
					</>
				)}
			</IssueHeader>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px] lg:gap-8">
				<div className="min-w-0 space-y-6 sm:space-y-8">
					<CommentBox
						className="-mx-4 sm:mx-0"
						author={{
							name: post.author?.nickname || "Anonymous",
							avatarUrl: post.author?.profileImageUrl,
						}}
						date={post.createdAt}
						content={content}
						headingIds={headingIds}
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

					{/* Comments Section */}
					<div className="space-y-8">
						<CommentList
							postId={post.postId}
							postAuthorUsername={post.author?.username}
						/>
						<CommentForm postId={post.postId} />
					</div>
				</div>

				<aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
					<ReadingHud headings={headings} />
					<PostDetailSidebar
						author={{
							nickname: post.author?.nickname || "Anonymous",
							profileImageUrl: post.author?.profileImageUrl,
						}}
						tags={post.tags}
						type={post.type}
					/>
				</aside>
			</div>
			</article>
		</>
	);
};
