import { Skeleton } from "@/shared/ui/skeleton";

export const ProfileSkeleton = () => {
    return (
        <div className="container max-w-2xl py-10 animate-fade-in">
            <Skeleton className="h-9 w-20 mb-8" />

            <div className="bg-card border rounded-xl p-6 shadow-sm space-y-8">
                {/* Profile Image Section */}
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="w-32 h-32 rounded-full border-4 border-background" />
                    <div className="flex flex-col items-center gap-1">
                        <Skeleton className="h-7 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-24 w-full" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </div>
        </div>
    );
};
