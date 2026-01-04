import { Skeleton } from "@/shared/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";

export const PostDetailSkeleton = () => {
    return (
        <article className="container max-w-3xl py-12 animate-pulse space-y-8">
            <div className="flex items-center justify-between gap-4">
                <Button variant="ghost" className="-ml-4 text-muted-foreground" disabled>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    뒤로가기
                </Button>
            </div>

            <header className="space-y-6">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16" />
                    <span className="opacity-30">|</span>
                    <Skeleton className="h-4 w-24" />
                </div>

                <Skeleton className="h-12 w-3/4 md:h-16" />

                <div className="flex items-center gap-4 py-2 border-y">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                </div>

                <div className="aspect-video w-full overflow-hidden rounded-3xl border">
                    <Skeleton className="h-full w-full" />
                </div>
            </header>

            <section className="space-y-4 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />

                <div className="py-8">
                    <Skeleton className="h-64 w-full rounded-xl" />
                </div>

                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </section>
        </article>
    );
};
