import { useState } from "react";

import { useAuthStore } from "@/entities/auth/model/auth.store";
import { useCreateComment } from "@/entities/comment/model/comment.mutations";
import { MarkdownEditor } from "@/shared/ui/markdown-editor";
import { Button } from "@/shared/ui/button";
import { useToast } from "@/shared/hooks/use-toast";
import { useUIStore } from "@/shared/store/use-ui-store";

interface CommentFormProps {
    postId: string;
}

export const CommentForm = ({ postId }: CommentFormProps) => {
    const { isAuthenticated, profile } = useAuthStore();
    const { openLoginModal } = useUIStore();
    const { mutateAsync: createComment, isPending } = useCreateComment(postId);
    const { toast } = useToast();
    const [content, setContent] = useState("");

    const handleSubmit = async () => {
        if (!content.trim()) return;

        try {
            await createComment({ postId, content });
            setContent("");
            toast({ title: "Comment added", description: "Your comment has been posted." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to post comment.", variant: "destructive" });
        }
    };

    return (
        <div className="flex gap-4">
            <div className="hidden md:block flex-none">
                <div className="w-10 h-10 rounded-full border bg-muted overflow-hidden">
                    {profile?.profileImageUrl ? (
                        <img src={profile.profileImageUrl} alt={profile.nickname} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                            {profile?.nickname?.slice(0, 2).toUpperCase() || "GE"}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="relative">
                    {/* Speech bubble arrow/pointer - can add later with CSS if needed to match GitHub exactly */}
                    <div className={!isAuthenticated ? "opacity-60 pointer-events-none select-none" : ""}>
                        <MarkdownEditor
                            value={content}
                            onChange={setContent}
                            placeholder="Leave a comment"
                            minRows={2}
                            disabled={!isAuthenticated}
                            footer={
                                isAuthenticated ? (
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={!content.trim() || isPending}
                                        >
                                            {isPending ? "Comment..." : "Comment"}
                                        </Button>
                                    </div>
                                ) : undefined
                            }
                        />
                    </div>

                    {!isAuthenticated && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <button
                                type="button"
                                onClick={openLoginModal}
                                className="text-sm font-medium text-white bg-luigi-green hover:bg-luigi-green/90 px-4 py-2 rounded shadow-sm border border-transparent transition-colors"
                            >
                                Sign in to comment
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
