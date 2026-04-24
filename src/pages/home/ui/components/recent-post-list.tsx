import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { postQueries } from "@/entities/post/model/post.queries";
import { PostStats } from "@/entities/post/ui/post-stats";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

import { RecentPostListSkeleton } from "./recent-post-list-skeleton";

export const RecentPostList = () => {
	const { data, isError, isLoading, refetch, isFetching } = useQuery(
		postQueries.list({ limit: 6, status: "PUBLISHED" }),
	);
	const navigate = useNavigate();

	if (isLoading) {
		return <RecentPostListSkeleton />;
	}

	if (isError) {
		return (
			<div className="space-y-4">
				<h2 className="text-base font-semibold">Recent Posts</h2>
				<div className="rounded-lg border border-dashed border-border bg-muted/20 p-4">
					<p className="text-sm font-medium text-foreground">Recent posts are unavailable.</p>
					<p className="mt-1 text-xs text-muted-foreground">
						The blog API returned an error. You can retry or open the full blog list.
					</p>
					<div className="mt-3 flex flex-wrap gap-2">
						<Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}>
							{isFetching ? "Retrying..." : "Retry"}
						</Button>
						<Button size="sm" variant="ghost" onClick={() => navigate("/blog")}>
							Go to Blog
						</Button>
					</div>
				</div>
			</div>
		);
	}

	const posts = data?.posts || [];

	return (
		<div className="space-y-4">
			<h2 className="text-base font-semibold">Recent Posts</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-w-0">
				{posts.slice(0, 6).map((post) => {
					return (
						<Card
							key={post.postId}
							className="bg-background border-border hover:border-luigi-green transition-colors cursor-pointer group flex flex-col min-h-[130px] shadow-sm relative"
							onClick={() =>
								navigate(`/posts/${post.author.username}/${post.slug}`)
							}
						>
							<CardHeader className="pb-1 pt-3 px-4">
								<div className="flex items-start justify-between gap-2">
									<span className="text-sm font-bold text-luigi-blue group-hover:underline truncate pr-16">
										{post.title}
									</span>
									<PostStats viewCount={post.viewCount} commentCount={post.commentCount} className="absolute top-3 right-4 bg-background/80 pl-2" iconClassName="h-3 w-3" />
								</div>
							</CardHeader>
							<CardContent className="px-4 pb-3 pt-0 flex-1 flex flex-col justify-between">
								<div className="flex items-center justify-between mt-auto">
									<div className="flex items-center gap-2">
										{post.tags?.slice(0, 2).map((tag) => (
											<Badge
												key={tag}
												variant="secondary"
												className="h-5 px-1.5 text-[10px] font-normal text-muted-foreground bg-muted hover:bg-muted-foreground/20"
											>
												{tag}
											</Badge>
										))}
									</div>
									<span className="text-[10px] opacity-80 text-muted-foreground">
										{new Date(post.createdAt).toLocaleDateString()}
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
				onClick={() => navigate("/blog")}
			>
				SHOW MORE
			</Button>
		</div>
	);
};
