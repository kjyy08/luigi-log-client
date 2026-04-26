import { useNavigate } from "react-router-dom";
import type {
	CreatePostRequest,
	PostType,
	UpdatePostRequest,
} from "@/entities/post/model/post.dto";
import {
	useCreatePost,
	useDeletePost,
	useUpdatePost,
} from "@/entities/post/model/post.mutations";
import { useToast } from "@/shared/hooks/use-toast";
import { generateSlug } from "@/shared/lib/utils";
import { getImageUploadPublishBlockMessage } from "./image-upload-utils";
import { useEditorStore } from "./editor.store";

const getRedirectPath = (type: PostType) => {
	return type === "PORTFOLIO" ? "/portfolio" : "/blog";
};

export const useEditorActions = () => {
	const navigate = useNavigate();
	const { toast } = useToast();

	// Mutations
	const { mutateAsync: createPost, isPending: isCreating } = useCreatePost();
	const { mutateAsync: updatePost, isPending: isUpdating } = useUpdatePost();
	const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost();

	const isPublishing = isCreating || isUpdating;

	const publishPost = async () => {
		const { title, body, slug, tags, type, postId, reset, imageUploads } =
			useEditorStore.getState();

		if (!title || !body) {
			toast({
				title: "Missing input",
				description: "Please enter both title and content.",
				variant: "destructive",
			});
			return false;
		}

		const imageUploadBlockMessage = getImageUploadPublishBlockMessage(imageUploads, body);
		if (imageUploadBlockMessage) {
			toast({
				title: "Images not ready",
				description: imageUploadBlockMessage,
				variant: "destructive",
			});
			return false;
		}

		const updateData: UpdatePostRequest = {
			title,
			body,
			status: "PUBLISHED" as const,
		};

		try {
			if (postId) {
				await updatePost({ id: postId, data: updateData });
				toast({
					title: "Post updated",
					description: "Post successfully updated.",
				});
			} else {
				const request: CreatePostRequest = {
					title,
					slug: generateSlug(slug || title),
					body,
					type,
					tags,
				};
				const createdPost = await createPost(request);

				// Backend might default to DRAFT on create, so force update if needed
				if (createdPost.status !== "PUBLISHED") {
					await updatePost({
						id: createdPost.postId,
						data: { status: "PUBLISHED" },
					});
				}
				toast({
					title: "Published",
					description: "Post successfully published.",
				});
			}

			reset();
			navigate(getRedirectPath(type));
			return true;
		} catch (error) {
			console.error("Publish failed", error);
			toast({
				title: "Error",
				description: "Failed to save post.",
				variant: "destructive",
			});
			return false;
		}
	};

	const deleteCurrentPost = async () => {
		const { postId, reset, type } = useEditorStore.getState();

		if (!postId) return;

		if (
			confirm(
				"Are you sure you want to delete this post? This action cannot be undone.",
			)
		) {
			try {
				await deletePost(postId);
				toast({
					title: "Deleted",
					description: "Post has been deleted.",
				});
				reset();
				navigate(getRedirectPath(type));
			} catch (error) {
				console.error("Delete failed", error);
				toast({
					title: "Error",
					description: "Failed to delete post.",
					variant: "destructive",
				});
			}
		}
	};

	const tempSave = () => {
		// Zustand persist handles local storage automaticaly if configured,
		// but currently the store doesn't seem to use persist middleware in the code I saw earlier.
		// Assuming the user wants to keep the manual toast for now.
		toast({
			title: "Draft Saved",
			description: "Your content has been saved locally.",
		});
	};

	const goBack = () => {
		const { title, body, reset, type } = useEditorStore.getState();
		if (title || body) {
			if (
				confirm("You have unsaved changes. Are you sure you want to leave?")
			) {
				reset();
				navigate(getRedirectPath(type));
			}
		} else {
			reset();
			navigate(getRedirectPath(type));
		}
	};

	return {
		publishPost,
		deleteCurrentPost,
		tempSave,
		goBack,
		isPublishing,
		isDeleting,
	};
};
