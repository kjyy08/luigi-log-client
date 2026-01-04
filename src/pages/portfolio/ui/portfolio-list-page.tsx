import { Button } from "@/shared/ui/button";
import { Link } from "react-router-dom";
import { PageHeader } from "@/shared/ui/page-header";
import { PostList } from "@/features/post-list";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { Pencil } from "lucide-react";
import React from "react";
import { PostListSkeleton } from "@/features/post-list/ui/post-list-skeleton";

export const PortfolioListPage = () => {
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="py-10 animate-fade-in">
            <PageHeader
                title="Portfolio"
                description="제가 지금까지 진행해온 프로젝트들을 소개합니다."
            >
                {isAuthenticated && (
                    <Button asChild className="bg-luigi-green hover:bg-luigi-green/90 text-white rounded-full px-6 font-bold shadow-md shadow-luigi-green/20">
                        <Link to="/write">
                            <Pencil className="mr-2 h-4 w-4" />
                            글쓰기
                        </Link>
                    </Button>
                )}
            </PageHeader>

            <React.Suspense fallback={<PostListSkeleton />}>
                <PostList fixedType="PORTFOLIO" showTabs={false} />
            </React.Suspense>
        </div>
    );
};
