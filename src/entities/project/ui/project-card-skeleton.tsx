import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";

export const ProjectCardSkeleton = ({ className }: { className?: string }) => {
    return (
        <div className={cn(
            "flex flex-col rounded-md border border-border bg-card p-4 transition-colors h-[150px]",
            className
        )}>
            {/* Header: Icon + Title + Public Badge */}
            <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-4 w-4 rounded-sm" /> {/* BookIcon */}
                <Skeleton className="h-5 w-32" /> {/* Title */}
                <Skeleton className="h-5 w-12 rounded-full ml-auto" /> {/* Public Badge (adjusted height to match text-xs badge) */}
            </div>

            {/* Body: Description */}
            <div className="space-y-2 mb-4 flex-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
            </div>

            {/* Footer: Tags + Stats */}
            <div className="flex items-center gap-4 mt-auto">
                <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3 rounded-full" /> {/* Color dot */}
                    <Skeleton className="h-3 w-16" /> {/* Tag name */}
                </div>

                <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3" /> {/* Star Icon */}
                    <Skeleton className="h-3 w-4" /> {/* Star Count */}
                </div>

                <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3" /> {/* Fork Icon */}
                    <Skeleton className="h-3 w-4" /> {/* Fork Count */}
                </div>
            </div>
        </div>
    );
};
