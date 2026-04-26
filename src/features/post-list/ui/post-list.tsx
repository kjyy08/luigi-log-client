import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { postQueries, type PostType, PostCard, useDeletePost, PostListItem } from "@/entities/post";
import { getPostList } from "@/entities/post/api/post.api";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { PostListSkeleton } from "./post-list-skeleton";

interface PostListProps {
	fixedType?: PostType;
	showTabs?: boolean;
	viewMode?: "grid" | "list";
	searchQuery?: string;
}

const TABS = [
	{ label: "All", value: "all" },
	{ label: "Tech", value: "BLOG" },
	{ label: "Portfolio", value: "PORTFOLIO" },
] as const;

const PAGE_SIZE = 10;

export const PostList = ({ fixedType, showTabs = true, viewMode = "grid", searchQuery }: PostListProps) => {
	const [activeTab, setActiveTab] = useState<string>(fixedType ?? "all");

	// If fixedType is provided, it takes precedence. Otherwise use activeTab.
	const typeFilter = fixedType ?? (activeTab === "all" ? undefined : (activeTab as PostType));
	const trimmedSearchQuery = searchQuery?.trim() || undefined;
	const listParams = {
		type: typeFilter,
		status: "PUBLISHED" as const,
		q: trimmedSearchQuery,
		limit: PAGE_SIZE,
	};

	const {
		data,
		isLoading,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: [...postQueries.lists(), listParams],
		queryFn: ({ pageParam }) => getPostList({
			...listParams,
			cursor: pageParam || undefined,
		}),
		initialPageParam: "" as string,
		getNextPageParam: (lastPage) => lastPage.pageInfo?.hasNext
			? (lastPage.pageInfo.nextCursor ?? undefined)
			: undefined,
	});

	const { isAuthenticated } = useAuthStore();
	const { mutateAsync: deletePost } = useDeletePost();

	const handleDelete = async (e: React.MouseEvent, postId: string) => {
		e.preventDefault();
		e.stopPropagation();

		if (confirm("Are you sure you want to delete this?")) {
			try {
				await deletePost(postId);
			} catch (error) {
				console.error("Delete failed", error);
				alert("Failed to delete");
			}
		}
	};

	const posts = data?.pages.flatMap((page) => page.posts) ?? [];
	const total = data?.pages[0]?.total ?? 0;

	return (
		<div className="space-y-6 min-w-0">
			{showTabs && !fixedType && (
				<div className="flex items-center gap-2 overflow-x-auto pb-1">
					{TABS.map((tab) => (
						<Button
							key={tab.value}
							variant={activeTab === tab.value ? "default" : "ghost"}
							onClick={() => setActiveTab(tab.value)}
							className={cn(
								"shrink-0 rounded-full px-6",
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

			{trimmedSearchQuery && (
				<p className="text-sm text-muted-foreground">
					{total} results for <span className="font-medium text-foreground">“{trimmedSearchQuery}”</span>
				</p>
			)}

			{isLoading ? (
				<PostListSkeleton viewMode={viewMode} count={5} />
			) : isError ? (
				<div className="rounded-lg border border-dashed border-border p-8 text-center">
					<p className="text-sm font-medium text-foreground">Failed to load posts.</p>
					<p className="mt-1 text-xs text-muted-foreground">Please retry or adjust your search.</p>
					<Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
						Retry
					</Button>
				</div>
			) : (
				<>
					<div className={cn(
						"grid min-w-0 gap-8",
						viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 gap-0"
					)}>
						{posts.length === 0 ? (
							<div className="col-span-full py-20 text-center text-muted-foreground">
								No posts found.
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

					{posts.length > 0 && hasNextPage && (
						<div className="flex justify-center pt-2">
							<Button
								variant="outline"
								onClick={() => fetchNextPage()}
								disabled={isFetchingNextPage}
							>
								{isFetchingNextPage ? "Loading more" : "Load more"}
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
};
