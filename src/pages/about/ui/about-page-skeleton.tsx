import { Skeleton } from "@/shared/ui/skeleton";

export const AboutPageSkeleton = () => {
    return (
        <div className="container max-w-4xl py-12 space-y-16 animate-fade-in">
            {/* Hero Section */}
            <section className="flex flex-col md:flex-row items-center gap-10">
                <div className="w-48 h-48 rounded-full border-4 border-background overflow-hidden shrink-0">
                    <Skeleton className="w-full h-full rounded-full" />
                </div>
                <div className="w-full text-center md:text-left space-y-4">
                    <Skeleton className="h-10 w-3/4 md:w-1/2 mx-auto md:mx-0" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-full md:w-2/3 mx-auto md:mx-0" />
                        <Skeleton className="h-6 w-5/6 mx-auto md:mx-0" />
                    </div>
                    <div className="flex justify-center md:justify-start gap-4 pt-2">
                        <Skeleton className="w-10 h-10 rounded-md" />
                        <Skeleton className="w-10 h-10 rounded-md" />
                        <Skeleton className="w-10 h-10 rounded-md" />
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="space-y-6">
                <Skeleton className="h-8 w-40" />
                <div className="flex flex-wrap gap-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-9 w-24 rounded-full" />
                    ))}
                </div>
            </section>
        </div>
    );
};
