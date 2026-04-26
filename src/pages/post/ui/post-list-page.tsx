import { Button } from "@/shared/ui/button";
import { Link } from "react-router-dom";
import { PageHeader } from "@/shared/ui/page-header";
import { PostList } from "@/features/post-list";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { Pencil } from "lucide-react";

export const PostListPage = () => {
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="py-10">
            <PageHeader
                title="Posts"
                description="A collection of posts on various topics."
            >
                {isAuthenticated && (
                    <Button asChild className="bg-luigi-green hover:bg-luigi-green/90 text-white rounded-full px-6 font-bold shadow-md shadow-luigi-green/20">
                        <Link to="/write">
                            <Pencil className="mr-2 h-4 w-4" />
                            New post
                        </Link>
                    </Button>
                )}
            </PageHeader>

            <PostList />
        </div>
    );
};
