import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Badge } from "@/shared/ui/badge";
import type { PostSummary } from "../model/post.dto";
import { PostStats } from "./post-stats";

interface PostListItemProps {
	post: PostSummary;
	showTopics?: boolean;
}

export const PostListItem = ({
	post,
	showTopics = true,
}: PostListItemProps) => {
	return (
		<div className="flex min-w-0 flex-col gap-2 rounded-md border-b border-border px-2 py-6 transition-colors last:border-0 hover:bg-muted/30 sm:-mx-2">
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-center gap-2 min-w-0">
					<Link
						to={`/posts/${post.author?.username || "anonymous"}/${post.slug}`}
						className="text-xl font-bold text-luigi-blue hover:underline hover:text-luigi-green transition-colors truncate"
					>
						{post.title}
					</Link>
					<Badge
						variant="outline"
						className="text-xs font-normal text-muted-foreground border-border rounded-full px-2 py-0.5 whitespace-nowrap"
					>
						Public
					</Badge>
				</div>

				<PostStats viewCount={post.viewCount} commentCount={post.commentCount} className="shrink-0" />
			</div>

			<div className="flex items-center gap-4 text-xs text-muted-foreground mt-1 flex-wrap">
				{showTopics && post.tags && post.tags.length > 0 && (
					<div className="flex items-center gap-2">
						{post.tags.map((tag) => (
							<Link
								key={tag}
								to={`/blog?tag=${encodeURIComponent(tag)}`}
								className="inline-flex items-center rounded-full bg-luigi-blue/10 px-2.5 py-0.5 text-xs font-semibold text-luigi-blue transition-colors hover:bg-luigi-blue/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							>
								{tag}
							</Link>
						))}
					</div>
				)}

				<div className="flex items-center gap-1">
					<span>
						Updated{" "}
						{formatDistanceToNow(new Date(post.createdAt), {
							addSuffix: true,
							locale: ko,
						})}
					</span>
				</div>
			</div>
		</div>
	);
};
