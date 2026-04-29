import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { postQueries } from "@/entities/post/model/post.queries";
import { useEditorStore } from "@/features/post-editor/model/editor.store";
import { EditorLayout } from "@/features/post-editor/ui/editor-layout";

export const EditPostPage = () => {
	const { id } = useParams<{ id: string }>();
	const postId = id ?? "";

	const { data: post } = useSuspenseQuery(postQueries.detail(postId));
	const {
		setTitle,
		setBody,
		setSlug,
		setTags,
		setType,
		setDescription,
		setPostId,
	} = useEditorStore();

	useEffect(() => {
		if (post) {
			setTitle(post.title);
			setBody(post.body ?? "");
			setSlug(post.slug);
			setTags(post.tags);
			setType(post.type);
			setDescription(post.description || "");
			setPostId(post.postId);
		}
	}, [
		post,
		setBody,
		setDescription,
		setPostId,
		setSlug,
		setTags,
		setTitle,
		setType,
	]); // Run when post data loads

	if (!id) return null; // Should be handled by router?

	return <EditorLayout />;
};
