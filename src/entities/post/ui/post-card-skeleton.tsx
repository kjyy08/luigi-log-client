import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";

interface PostCardSkeletonProps {
    className?: string;
}

export const PostCardSkeleton = ({ className }: PostCardSkeletonProps) => {
    return (
        <div className={cn(
            "flex flex-col gap-4 rounded-2xl border p-5",
            className
        )}>
            {/* Thumbnail Placeholder */}
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-border/50">
                <Skeleton className="h-full w-full" />
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-7 w-3/4" />
                <div className="space-y-1 pt-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>

            <div className="mt-auto flex flex-wrap gap-2 pt-2">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-md" />
                <Skeleton className="h-5 w-14 rounded-md" />
            </div>
        </div>
    );
};
