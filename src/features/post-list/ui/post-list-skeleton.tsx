import { PostCardSkeleton } from "@/entities/post/ui/post-card-skeleton";

interface PostListSkeletonProps {
    count?: number;
}

export const PostListSkeleton = ({ count = 6 }: PostListSkeletonProps) => {
    return (
        <div className="space-y-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: count }).map((_, i) => (
                    <PostCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
};
