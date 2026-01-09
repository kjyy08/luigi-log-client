import { Link } from "react-router-dom";
import { PageHeader } from "@/shared/ui/page-header";
import { PostList } from "@/features/post-list";
import { useIsOwner } from "@/shared/hooks/use-is-owner";
import { Button } from "@/shared/ui/button";
import { Pencil } from "lucide-react";
import React from "react";
import { PostListSkeleton } from "@/features/post-list/ui/post-list-skeleton";

export const BlogListPage = () => {
    const isOwner = useIsOwner();

    return (
        <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                <PageHeader
                    title="게시글"
                    description="블로그 포스팅 관련 게시글입니다."
                    className="mb-0 border-none pb-0"
                />
                {isOwner && (
                    <Button asChild className="bg-luigi-green hover:bg-luigi-green/90 text-white rounded-md px-4 font-bold shadow-sm h-9">
                        <Link to="/write">
                            <Pencil className="mr-2 h-4 w-4" />
                            글쓰기
                        </Link>
                    </Button>
                )}
            </div>

            <div className="border-b border-border mb-6" />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content - Repository List */}
                <div className="flex-1">
                    <React.Suspense fallback={<PostListSkeleton viewMode="list" count={5} />}>
                        <PostList fixedType="BLOG" showTabs={false} viewMode="list" />
                    </React.Suspense>
                </div>

                {/* Sidebar (Optional, maybe for popular tags or profile summary if needed, but not specified in 1-col layout explicitly. Plan says "Layout: 상단 필터 바가 있는 1단 리스트 레이아웃" (1-column list layout with top filter bar). So I will stick to 1 column or 2 columns if sidebar is standard. 1-column implies full width or centered. Github Repos page is effectively 1 main column with a small sidebar for profile on the left, but here we are in /blog, so it might just be the list.
                 Wait, GitHub Profile > Repositories tab IS 1-column. Profile sidebar is usually on the left if it's the main profile page. 
                 But this is `pages/blog` which maps to "Repositories".
                 If we follow GitHub, "Repositories" tab has the profile sidebar on the left.
                 But the Plan says: "Layout: 상단 필터 바가 있는 1단 리스트 레이아웃" for `BlogListPage`.
                 So I will assume just 1 column for the list.
                 */}
            </div>
        </div>
    );
};
