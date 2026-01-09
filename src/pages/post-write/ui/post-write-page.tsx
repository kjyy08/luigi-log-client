import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { postQueries } from "@/entities/post/model/post.queries";
import { useEditorStore } from "@/features/post-editor/model/editor.store";
import { useEditorActions } from "@/features/post-editor/model/use-editor-actions";
import { IssueEditor } from "@/features/post-editor/ui/issue-editor";
import { PostEditorSidebar } from "@/features/post-editor/ui/post-editor-sidebar";
import { Button } from "@/shared/ui/button";
import { Loader2 } from "lucide-react";


export const PostWritePage = () => {
    const { id } = useParams<{ id: string }>();
    const {
        setTitle, setBody, setSlug, setTags, setType,
        setThumbnail, setDescription, setPostId, reset
    } = useEditorStore();

    const { publishPost, isPublishing } = useEditorActions();

    // Fetch data if editing
    const { data: post, isLoading } = useQuery({
        ...postQueries.detail(id!),
        enabled: !!id,
    });

    useEffect(() => {
        if (id && post) {
            setTitle(post.title);
            setBody(post.body);
            setSlug(post.slug);
            setTags(post.tags);
            setType(post.type);
            setThumbnail(post.thumbnail || null);
            setDescription(post.description || "");
            setPostId(post.postId);
        } else if (!id) {
            // Reset if creating new post
            reset();
        }
    }, [post, id, reset, setTitle, setBody, setSlug, setTags, setType, setThumbnail, setDescription, setPostId]);

    if (id && isLoading) {
        return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="container max-w-7xl py-8 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {id ? "Edit Post" : "Create New Post"}
                </h1>
                <p className="text-muted-foreground text-sm">
                    {id ? "Updates will be reflected immediately." : "Share your thoughts with the world."}
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1 w-full space-y-4">
                    <IssueEditor />

                    <div className="flex justify-end gap-2 px-4 lg:px-8">
                        <Button
                            variant="default"
                            onClick={publishPost}
                            disabled={isPublishing}
                            className="bg-luigi-green hover:bg-luigi-green/90 text-white font-bold"
                        >
                            {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {id ? "Update Post" : "Submit New Post"}
                        </Button>
                    </div>
                </div>

                <PostEditorSidebar />
            </div>
        </div>
    );
};
