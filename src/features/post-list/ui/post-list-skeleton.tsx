import { PostCardSkeleton } from "@/entities/post/ui/post-card-skeleton";
import { ProjectCardSkeleton } from "@/entities/project/ui/project-card-skeleton";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";

interface PostListSkeletonProps {
    count?: number;
    viewMode?: "grid" | "list";
    variant?: "default" | "project";
    className?: string;
}

export const PostListSkeleton = ({
    count = 6,
    viewMode = "grid",
    variant = "default",
    className
}: PostListSkeletonProps) => {
    return (
        <div className="space-y-6">
            <div className={cn(
                "grid gap-8",
                viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 gap-0 space-y-4",
                className
            )}>
                {Array.from({ length: count }).map((_, i) => (
                    viewMode === "list" ? (
                        <div key={i} className="py-6 border-b border-border first:pt-0">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2 w-full max-w-2xl">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                    </div>
                                    <Skeleton className="h-4 w-3/4" />
                                    <div className="flex items-center gap-4 mt-4">
                                        <div className="flex items-center gap-1">
                                            <Skeleton className="h-3 w-3 rounded-full" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-24 hidden sm:block" />
                            </div>
                        </div>
                    ) : (
                        variant === "project" ? (
                            <ProjectCardSkeleton key={i} />
                        ) : (
                            <PostCardSkeleton key={i} />
                        )
                    )
                ))}
            </div>
        </div>
    );
};
