import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeletePost } from "@/entities/post/model/post.mutations";
import { postQueries } from "@/entities/post/model/post.queries";
import { getAdjacentPostInnerColumnClassName } from "@/entities/post/model/adjacent-post-navigation";
import { PostAdjacentNavigation } from "@/entities/post/ui/post-adjacent-navigation";
import { useIsOwner } from "@/shared/hooks/use-is-owner";
import { cn } from "@/shared/lib/utils";
import { useToast } from "@/shared/hooks/use-toast";
import { SeoMetadataTags } from "@/shared/seo";
import { Button } from "@/shared/ui/button";
import { CommentBox } from "./comment-box";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { IssueHeader } from "./issue-header";
import { PostDetailSidebar } from "./post-detail-sidebar";
import { PostDetailSkeleton } from "./post-detail-skeleton";
import { ReadingHud, ReadingProgress } from "./reading-hud";
import { getPostAdjacentNavigationProps } from "../model/post-adjacent-navigation-props";
import { buildPostDetailMetadata } from "../model/post-detail-seo-metadata";
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
	const adjacentNavigationProps = post
		? getPostAdjacentNavigationProps(post, username)
		: null;
	const seoMetadata = post && username && slug
		? buildPostDetailMetadata({ username, slug, post })
		: null;
	const adjacentInnerColumnClassName = getAdjacentPostInnerColumnClassName();

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
			{seoMetadata && <SeoMetadataTags metadata={seoMetadata} />}
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

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
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
						headings={headings}
						type="ISSUE"
					/>

					{adjacentNavigationProps && (
						<PostAdjacentNavigation
							className={adjacentInnerColumnClassName}
							previousPost={adjacentNavigationProps.previousPost}
							nextPost={adjacentNavigationProps.nextPost}
							currentUsername={adjacentNavigationProps.currentUsername}
						/>
					)}

					<div className={cn("relative py-8", adjacentInnerColumnClassName)}>
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

				<aside className="space-y-6 lg:sticky lg:top-24 lg:flex lg:max-h-[calc(100vh-6rem)] lg:flex-col lg:self-start lg:overflow-hidden lg:space-y-0 lg:gap-6">
					<PostDetailSidebar
						author={{
							nickname: post.author?.nickname || "Anonymous",
							profileImageUrl: post.author?.profileImageUrl,
						}}
						tags={post.tags}
						type={post.type}
					/>
					<ReadingHud headings={headings} />
				</aside>
			</div>
			</article>
		</>
	);
};
