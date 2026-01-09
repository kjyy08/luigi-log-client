import { Skeleton } from "@/shared/ui/skeleton";

export const PostDetailSkeleton = () => {
    return (
        <article className="container max-w-7xl py-8 animate-pulse">
            {/* Header: Title and Meta */}
            <div className="border-b border-border pb-8 mb-8 space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-3/4 md:h-12" />
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-7 w-20 rounded-full" /> {/* State Badge */}
                        <Skeleton className="h-5 w-48" /> {/* Meta info */}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                {/* Main Content (Issue Body) */}
                <div className="space-y-8 min-w-0">
                    {/* Post Body Box */}
                    <div className="rounded-md border border-border">
                        <div className="flex items-center gap-2 p-3 border-b border-border bg-muted/30">
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="p-8 space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <div className="py-4">
                                <Skeleton className="w-full aspect-video rounded-md" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="space-y-6 pt-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                                <div className="flex-1 rounded-md border border-border">
                                    <div className="flex items-center gap-2 p-3 border-b border-border bg-muted/30">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                    <div className="p-4 space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="pb-2 border-b border-border">
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                        <div className="pb-2 border-b border-border">
                            <Skeleton className="h-4 w-16 mb-2" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                        <div className="pb-2 border-b border-border">
                            <Skeleton className="h-4 w-20 mb-2" />
                            <div className="flex flex-wrap gap-1">
                                <Skeleton className="h-5 w-16 rounded-full" />
                                <Skeleton className="h-5 w-12 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};
