import { Card, CardHeader, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

export const RecentPostListSkeleton = () => {
    return (
        <div className="space-y-4">
            <Skeleton className="h-6 w-32" /> {/* Title: 최근 게시글 */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="bg-background border-border h-[130px] flex flex-col shadow-sm relative">
                        <CardHeader className="pb-1 pt-3 px-4">
                            <div className="flex items-start justify-between gap-2">
                                <Skeleton className="h-5 w-2/3" /> {/* Title */}
                                <div className="absolute top-3 right-4 flex gap-2"> {/* Metadata Top Right */}
                                    <Skeleton className="h-3 w-8" />
                                    <Skeleton className="h-3 w-8" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-3 pt-0 flex-1 flex flex-col justify-between">
                            <Skeleton className="h-4 w-full mt-2" /> {/* Description line 1 */}

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex gap-1"> {/* Tags */}
                                    <Skeleton className="h-5 w-12 rounded-full" />
                                    <Skeleton className="h-5 w-12 rounded-full" />
                                </div>
                                <Skeleton className="h-3 w-20" /> {/* Date */}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center">
                <Skeleton className="h-4 w-24" /> {/* Show More Button */}
            </div>
        </div>
    );
};
