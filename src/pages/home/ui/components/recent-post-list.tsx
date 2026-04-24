import { useQuery } from "@tanstack/react-query";
import { Eye, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { postQueries } from "@/entities/post/model/post.queries";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

import { RecentPostListSkeleton } from "./recent-post-list-skeleton";

export const RecentPostList = () => {
	const { data, isError, isLoading } = useQuery(
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
				<p className="text-xs text-muted-foreground">
					Failed to load recent posts.
				</p>
			</div>
		);
	}

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
							onClick={() =>
								navigate(`/posts/${post.author.username}/${post.slug}`)
							}
						>
							<CardHeader className="pb-1 pt-3 px-4">
								<div className="flex items-start justify-between gap-2">
									<span className="text-sm font-bold text-luigi-blue group-hover:underline truncate pr-16">
										{post.title}
									</span>
									<div className="absolute top-3 right-4 flex items-center gap-3 text-xs text-muted-foreground bg-background/80 pl-2">
										<div className="flex items-center gap-1">
											<Eye className="w-3 h-3" />
											<span>{post.viewCount ?? 0}</span>
										</div>
										<div className="flex items-center gap-1">
											<MessageSquare className="w-3 h-3" />
											<span>{post.commentCount ?? 0}</span>
										</div>
									</div>
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
