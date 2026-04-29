import { useQuery } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { postQueries } from "@/entities/post/model/post.queries";
import { getImageUploadPublishBlockMessage } from "@/features/post-editor/model/image-upload-utils";
import { useEditorStore } from "@/features/post-editor/model/editor.store";
import { useEditorActions } from "@/features/post-editor/model/use-editor-actions";
import { IssueEditor } from "@/features/post-editor/ui/issue-editor";
import { PostEditorSidebar } from "@/features/post-editor/ui/post-editor-sidebar";
import { Button } from "@/shared/ui/button";

export const PostWritePage = () => {
	const { id } = useParams<{ id: string }>();
	const {
		setTitle,
		setBody,
		setSlug,
		setTags,
		setType,
		setDescription,
		setPostId,
		reset,
		body,
		imageUploads,
	} = useEditorStore();

	const { publishPost, tempSave, isPublishing } = useEditorActions();
	const imageUploadBlockMessage = getImageUploadPublishBlockMessage(imageUploads, body);
	const primaryActions = (
		<div className="space-y-3">
			<div>
				<p className="text-sm font-semibold">Actions</p>
				<p className="text-xs text-muted-foreground">
					{id ? "Update this post without scrolling." : "Save locally or publish without scrolling."}
				</p>
			</div>
			{imageUploadBlockMessage && (
				<p className="text-sm text-destructive" role="status">
					{imageUploadBlockMessage}
				</p>
			)}
			<div className="flex flex-col gap-2">
				{!id && (
					<Button variant="outline" onClick={tempSave} className="w-full border-luigi-green/50 text-luigi-green hover:bg-luigi-green/10">
						<Save className="mr-2 h-4 w-4" />
						Save Draft
					</Button>
				)}
				<Button
					variant="default"
					onClick={publishPost}
					disabled={isPublishing || !!imageUploadBlockMessage}
					className="w-full bg-luigi-green hover:bg-luigi-green/90 text-white font-bold"
				>
					{isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{id ? "Update Post" : "Publish Post"}
				</Button>
			</div>
		</div>
	);

	// Fetch data if editing
	const { data: post, isLoading } = useQuery({
		...postQueries.detail(id ?? ""),
		enabled: !!id,
	});

	useEffect(() => {
		if (id && post) {
			setTitle(post.title);
			setBody(post.body ?? "");
			setSlug(post.slug);
			setTags(post.tags);
			setType(post.type);
			setDescription(post.description || "");
			setPostId(post.postId);
		} else if (!id) {
			// Reset if creating new post
			reset();
		}
	}, [
		post,
		id,
		reset,
		setTitle,
		setBody,
		setSlug,
		setTags,
		setType,
		setDescription,
		setPostId,
	]);

	if (id && isLoading) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<Loader2 className="animate-spin" />
			</div>
		);
	}

	return (
		<div className="container max-w-7xl py-8 space-y-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-semibold tracking-tight">
					{id ? "Edit Post" : "Create New Post"}
				</h1>
				<p className="text-muted-foreground text-sm">
					{id
						? "Updates will be reflected immediately."
						: "Share your thoughts with the world."}
				</p>
			</div>

			<div className="flex flex-col lg:flex-row gap-8 items-start">
				<div className="flex-1 w-full space-y-4">
					<div className="lg:hidden">
						<PostEditorSidebar actions={primaryActions} />
					</div>

					<IssueEditor />
				</div>

				<div className="hidden lg:block">
					<PostEditorSidebar actions={primaryActions} />
				</div>
			</div>
		</div>
	);
};
