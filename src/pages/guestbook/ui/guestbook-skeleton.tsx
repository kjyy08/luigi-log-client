import { Skeleton } from "@/shared/ui/skeleton";

export const GuestbookSkeleton = () => {
    return (
        <div className="flex flex-col md:flex-row gap-8 mt-8">
            <div className="flex-1">
                {/* Search Bar Skeleton */}
                <div className="bg-muted/30 border border-border rounded-t-md p-2 flex items-center gap-2 mb-[-1px] z-10 relative h-[53px]">
                    <Skeleton className="h-9 w-full rounded-md" />
                </div>

                {/* List Skeleton */}
                <div className="border border-border rounded-b-md rounded-t-none divide-y divide-border bg-card">
                    {/* Header */}
                    <div className="p-4 bg-muted/10 border-b border-border flex justify-between items-center h-[53px]">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                    </div>

                    {/* Items */}
                    <div className="px-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex gap-4 border-b border-border py-4 px-4 -mx-4 sm:px-0 sm:mx-0">
                                <Skeleton className="h-10 w-10 rounded-full hidden sm:block" />
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex gap-2">
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-1">
                                    <div className="flex flex-col items-center gap-1">
                                        <Skeleton className="h-3 w-3" />
                                        <Skeleton className="h-3 w-3" />
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Skeleton className="h-3 w-3" />
                                        <Skeleton className="h-3 w-3" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sidebar Skeleton */}
            <aside className="w-full md:w-64 space-y-6 hidden md:block">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </aside>
        </div>
    );
};
