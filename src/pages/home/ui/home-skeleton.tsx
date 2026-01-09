import { Skeleton } from "@/shared/ui/skeleton";
import { RecentPostListSkeleton } from "./components/recent-post-list-skeleton";

export const HomeSkeleton = () => {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Sidebar Skeleton (Profile) */}
                <div className="md:col-span-4 lg:col-span-3 space-y-6">
                    <div className="space-y-4">
                        <Skeleton className="w-full aspect-square rounded-full md:rounded-full lg:rounded-full border border-border" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-5 w-1/2" />
                        </div>
                        <div className="space-y-2 pt-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                        <div className="space-y-3 pt-4">
                            <Skeleton className="h-9 w-full rounded-md" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content Skeleton */}
                <div className="md:col-span-8 lg:col-span-9 space-y-8">
                    {/* Readme Section Skeleton */}
                    <div className="border border-border rounded-lg p-6 bg-card/50">
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-40" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        </div>
                    </div>

                    {/* Recent Posts Skeleton */}
                    <RecentPostListSkeleton />

                    {/* Contribution Graph Skeleton */}
                    <div className="border border-border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-48" />
                        </div>
                        {/* Matches the new h-[100px] size roughly */}
                        <Skeleton className="h-[120px] w-full" />
                    </div>

                    {/* Activity Log Skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-32" /> {/* Title: 최근 작성된 댓글 */}
                        <div className="space-y-4 pl-4 border-l ml-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="relative pl-6">
                                    <Skeleton className="absolute -left-[29px] w-6 h-6 rounded-full border-2 border-background" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
