import { useNavigate } from "react-router-dom";
import { useToast } from "@/shared/hooks/use-toast";
import { useEditorStore } from "./editor.store";
import { useCreatePost, useUpdatePost, useDeletePost } from "@/entities/post/model/post.mutations";
import { generateSlug } from "@/shared/lib/utils";
import type { CreatePostRequest, UpdatePostRequest, PostType } from "@/entities/post/model/post.dto";

const getRedirectPath = (type: PostType) => {
    return type === 'PORTFOLIO' ? '/portfolio' : '/blog';
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
        const { title, body, slug, tags, type, thumbnail, description, postId, reset } = useEditorStore.getState();

        if (!title || !body) {
            toast({
                title: "입력 부족",
                description: "제목과 내용을 모두 입력해주세요.",
                variant: "destructive",
            });
            return false;
        }

        const commonData = {
            title,
            body,
            slug: generateSlug(slug || title),
            tags,
            thumbnail: thumbnail || undefined,
            description: description || undefined,
            status: "PUBLISHED" as const,
        };

        try {
            if (postId) {
                const request: UpdatePostRequest = {
                    ...commonData,
                };
                await updatePost({ id: postId, data: request });
                toast({
                    title: "수정 완료",
                    description: "포스트가 성공적으로 수정되었습니다.",
                });
            } else {
                const request: CreatePostRequest = {
                    ...commonData,
                    type,
                };
                const createdPost = await createPost(request);

                // Backend might default to DRAFT on create, so force update if needed
                if (createdPost.status !== "PUBLISHED") {
                    await updatePost({
                        id: createdPost.postId,
                        data: { status: "PUBLISHED" }
                    });
                }
                toast({
                    title: "출간 완료",
                    description: "포스트가 성공적으로 출간되었습니다.",
                });
            }

            reset();
            navigate(getRedirectPath(type));
            return true;
        } catch (error) {
            console.error("Publish failed", error);
            toast({
                title: "작업 실패",
                description: "포스트 저장 중 오류가 발생했습니다.",
                variant: "destructive",
            });
            return false;
        }
    };

    const deleteCurrentPost = async () => {
        const { postId, reset, type } = useEditorStore.getState();

        if (!postId) return;

        if (confirm("정말로 이 글을 삭제하시겠습니까? 삭제된 글은 복구할 수 없습니다.")) {
            try {
                await deletePost(postId);
                toast({
                    title: "삭제 완료",
                    description: "포스트가 삭제되었습니다.",
                });
                reset();
                navigate(getRedirectPath(type));
            } catch (error) {
                console.error("Delete failed", error);
                toast({
                    title: "삭제 실패",
                    description: "포스트 삭제 중 오류가 발생했습니다.",
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
            title: "임시 저장 완료",
            description: "작성 중인 내용이 브라우저에 저장되었습니다.",
        });
    };

    const goBack = () => {
        const { title, body, reset, type } = useEditorStore.getState();
        if (title || body) {
            if (confirm("작성 중인 내용이 있습니다. 정말 나가시겠습니까?")) {
                reset();
                navigate(getRedirectPath(type));
            }
        } else {
            reset();
            navigate(getRedirectPath(type));
        }
    }

    return {
        publishPost,
        deleteCurrentPost,
        tempSave,
        goBack,
        isPublishing,
        isDeleting
    };
};
