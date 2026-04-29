import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import type { AdjacentPost } from "../model/post.dto";
import { buildAdjacentPostPath, getAdjacentPostSlotClassName, hasAdjacentPosts } from "../model/adjacent-post-navigation";

interface PostAdjacentNavigationProps {
	previousPost?: AdjacentPost | null;
	nextPost?: AdjacentPost | null;
	currentUsername: string;
	className?: string;
}

interface AdjacentPostCardProps {
	post: AdjacentPost;
	direction: "previous" | "next";
	currentUsername: string;
}

const AdjacentPostCard = ({
	post,
	direction,
	currentUsername,
}: AdjacentPostCardProps) => {
	const isPrevious = direction === "previous";
	const label = isPrevious ? "Previous post" : "Next post";
	const ariaLabel = isPrevious
		? `Go to previous post: ${post.title}`
		: `Go to next post: ${post.title}`;

	return (
		<Link
			to={buildAdjacentPostPath(post, currentUsername)}
			aria-label={ariaLabel}
			className={cn(
				"group flex min-h-24 flex-col justify-between rounded-md border border-white/10 bg-white/[0.015] px-4 py-3 transition-colors hover:border-white/20 hover:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luigi-green/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				getAdjacentPostSlotClassName(direction),
				!isPrevious && "text-right",
			)}
		>
			<span
				className={cn(
					"flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors group-hover:text-foreground",
					!isPrevious && "justify-end",
				)}
			>
				{isPrevious && <span aria-hidden="true">←</span>}
				<span>{label}</span>
				{!isPrevious && <span aria-hidden="true">→</span>}
			</span>
			<span className="mt-3 line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-luigi-green">
				{post.title}
			</span>
		</Link>
	);
};

export const PostAdjacentNavigation = ({
	previousPost,
	nextPost,
	currentUsername,
	className,
}: PostAdjacentNavigationProps) => {
	if (!hasAdjacentPosts(previousPost, nextPost)) return null;

	return (
		<nav
			aria-labelledby="post-adjacent-navigation-title"
			className={cn("space-y-3", className)}
		>
			<h2
				id="post-adjacent-navigation-title"
				className="text-sm font-semibold text-muted-foreground"
			>
				Continue reading
			</h2>
			<div className="grid gap-3 sm:grid-cols-2">
				{previousPost && (
					<AdjacentPostCard
						post={previousPost}
						direction="previous"
						currentUsername={currentUsername}
					/>
				)}
				{nextPost && (
					<AdjacentPostCard
						post={nextPost}
						direction="next"
						currentUsername={currentUsername}
					/>
				)}
			</div>
		</nav>
	);
};
