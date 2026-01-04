import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postQueries } from "@/entities/post/model/post.queries";
import { EditorLayout } from "@/features/post-editor/ui/editor-layout";
import { useEditorStore } from "@/features/post-editor/model/editor.store";

export const EditPostPage = () => {
    const { id } = useParams<{ id: string }>();
    if (!id) return null; // Should be handled by router?

    const { data: post } = useSuspenseQuery(postQueries.detail(id));
    const {
        setTitle, setBody, setSlug, setTags, setType,
        setThumbnail, setDescription, setPostId
    } = useEditorStore();

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setBody(post.body);
            setSlug(post.slug);
            setTags(post.tags);
            setType(post.type);
            setThumbnail(post.thumbnail || null);
            setDescription(post.description || "");
            setPostId(post.postId);
        }
    }, [post, id]); // Run when post data loads

    return <EditorLayout />;
};
