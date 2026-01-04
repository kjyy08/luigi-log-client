import { Button } from "@/shared/ui/button";
import { Link } from "react-router-dom";
import { PageHeader } from "@/shared/ui/page-header";
import { PostList } from "@/features/post-list";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { Pencil } from "lucide-react";

export const PostListPage = () => {
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="py-10 animate-fade-in">
            <PageHeader
                title="Posts"
                description="다양한 주제의 포스트를 모아둔 공간입니다."
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

            <PostList />
        </div>
    );
};
