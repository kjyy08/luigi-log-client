import { Eye, MessageSquare } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface PostStatsProps {
	viewCount?: number | null;
	commentCount?: number | null;
	className?: string;
	iconClassName?: string;
	showLabels?: boolean;
}

export const PostStats = ({
	viewCount,
	commentCount,
	className,
	iconClassName,
	showLabels = false,
}: PostStatsProps) => {
	return (
		<div
			className={cn(
				"flex items-center gap-3 text-xs text-muted-foreground",
				className,
			)}
		>
			<span className="inline-flex items-center gap-1 whitespace-nowrap">
				<Eye className={cn("h-3.5 w-3.5", iconClassName)} aria-hidden="true" />
				<span>{viewCount ?? 0}</span>
				{showLabels && <span>views</span>}
			</span>
			<span className="inline-flex items-center gap-1 whitespace-nowrap">
				<MessageSquare
					className={cn("h-3.5 w-3.5", iconClassName)}
					aria-hidden="true"
				/>
				<span>{commentCount ?? 0}</span>
				{showLabels && <span>comments</span>}
			</span>
		</div>
	);
};
