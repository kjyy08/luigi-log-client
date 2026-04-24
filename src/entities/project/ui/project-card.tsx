import { BookMarked } from "lucide-react";
import { Link } from "react-router-dom";
import type { PostSummary } from "@/entities/post/model/post.dto";
import { PostStats } from "@/entities/post/ui/post-stats";
import { cn } from "@/shared/lib/utils";

interface ProjectCardProps {
	project: PostSummary;
	className?: string;
}

export const ProjectCard = ({ project, className }: ProjectCardProps) => {
	return (
		<div
			className={cn(
				"flex flex-col rounded-md border border-border bg-card p-4 text-card-foreground transition-colors hover:bg-muted/50",
				className,
			)}
		>
			<div className="flex items-center gap-2 mb-2">
				<BookMarked className="h-4 w-4 text-muted-foreground" />
				<Link
					to={`/posts/${project.author.username}/${project.slug}`}
					className="font-semibold text-foreground hover:underline hover:text-luigi-green"
				>
					{project.title}
				</Link>
				<div className="ml-auto rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
					Public
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-auto">
				{project.tags && project.tags.length > 0 && (
					<div className="flex items-center gap-1">
						<span className="inline-block w-3 h-3 rounded-full bg-luigi-green/80" />
						<span>{project.tags[0]}</span>
					</div>
				)}
				<PostStats viewCount={project.viewCount} commentCount={project.commentCount} />
			</div>
		</div>
	);
};
