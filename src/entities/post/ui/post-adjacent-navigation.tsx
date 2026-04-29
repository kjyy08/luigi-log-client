import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import type { AdjacentPost } from "../model/post.dto";
import {
	buildAdjacentPostAriaLabel,
	buildAdjacentPostPath,
	getAdjacentPostPlacementClassName,
	hasAdjacentPosts,
	type AdjacentPostDirection,
} from "../model/adjacent-post-navigation";

interface PostAdjacentNavigationProps {
	previousPost?: AdjacentPost | null;
	nextPost?: AdjacentPost | null;
	currentUsername: string;
	className?: string;
}

interface AdjacentPostCardProps {
	post: AdjacentPost;
	direction: AdjacentPostDirection;
	currentUsername: string;
	hasPreviousPost: boolean;
	hasNextPost: boolean;
}

const AdjacentPostCard = ({
	post,
	direction,
	currentUsername,
	hasPreviousPost,
	hasNextPost,
}: AdjacentPostCardProps) => {
	const isPrevious = direction === "previous";
	const label = isPrevious ? "← Previous post" : "Next post →";

	return (
		<Link
			to={buildAdjacentPostPath(post, currentUsername)}
			aria-label={buildAdjacentPostAriaLabel(post, direction)}
			className={cn(
				"group flex min-h-32 w-full min-w-0 max-w-full flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-luigi-green/40 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luigi-green focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-5",
				getAdjacentPostPlacementClassName(direction, hasPreviousPost, hasNextPost),
			)}
		>
			<span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors group-hover:text-luigi-green">
				{label}
			</span>
			<span className="mt-4 line-clamp-2 min-w-0 break-words text-base font-semibold leading-snug text-foreground transition-colors [overflow-wrap:anywhere] group-hover:text-luigi-green sm:text-lg">
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

	const hasPreviousPost = Boolean(previousPost);
	const hasNextPost = Boolean(nextPost);

	return (
		<nav
			aria-labelledby="post-adjacent-navigation-title"
			className={cn("w-full min-w-0 max-w-full space-y-3", className)}
		>
			<h2
				id="post-adjacent-navigation-title"
				className="text-sm font-semibold text-muted-foreground"
			>
				Continue reading
			</h2>
			<div className="grid w-full min-w-0 max-w-full gap-3 sm:grid-cols-2">
				{previousPost && (
					<AdjacentPostCard
						post={previousPost}
						direction="previous"
						currentUsername={currentUsername}
						hasPreviousPost={hasPreviousPost}
						hasNextPost={hasNextPost}
					/>
				)}
				{nextPost && (
					<AdjacentPostCard
						post={nextPost}
						direction="next"
						currentUsername={currentUsername}
						hasPreviousPost={hasPreviousPost}
						hasNextPost={hasNextPost}
					/>
				)}
			</div>
		</nav>
	);
};
