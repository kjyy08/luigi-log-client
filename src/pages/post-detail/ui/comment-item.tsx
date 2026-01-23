import { useState } from "react";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { useDeleteComment, useUpdateComment } from "@/entities/comment/model/comment.mutations";
import { CommentBox } from "./comment-box";
import { Button } from "@/shared/ui/button";
import { MarkdownEditor } from "@/shared/ui/markdown-editor";
import { Pencil, Trash2, X } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import type { Comment } from "@/entities/comment/model/comment.dto";

interface CommentItemProps {
    comment: Comment;
    postAuthorUsername?: string;
    postId: string;
}

export const CommentItem = ({ comment, postAuthorUsername, postId }: CommentItemProps) => {
    const { member } = useAuthStore();
    const { mutateAsync: deleteComment } = useDeleteComment(postId);
    const { mutateAsync: updateComment, isPending: isUpdating } = useUpdateComment(postId);
    const { toast } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    const isAuthor = comment.author.username === postAuthorUsername;
    const isMyComment = member?.username === comment.author.username;

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this comment?")) {
            try {
                await deleteComment(comment.commentId);
                toast({ title: "Deleted", description: "Comment deleted." });
            } catch (e) {
                toast({ title: "Error", description: "Failed to delete comment.", variant: "destructive" });
            }
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditContent(comment.content);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditContent(comment.content);
    };

    const handleSaveEdit = async () => {
        if (!editContent.trim()) return;
        try {
            await updateComment({ commentId: comment.commentId, content: editContent });
            setIsEditing(false);
            toast({ title: "Updated", description: "Comment updated." });
        } catch (e) {
            toast({ title: "Error", description: "Failed to update comment.", variant: "destructive" });
        }
    };

    if (isEditing) {
        return (
            <div className="flex gap-4 group relative">
                <div className="hidden md:block flex-none">
                    <div className="w-10 h-10 rounded-full border bg-muted overflow-hidden">
                        {comment.author.profileImageUrl ? (
                            <img src={comment.author.profileImageUrl} alt={comment.author.nickname} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                                {comment.author.nickname.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="border rounded-md bg-background shadow-sm overflow-hidden">
                        {/* Reuse Header Style */}
                        <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border-b text-sm">
                            <span className="font-semibold text-foreground">
                                {comment.author.nickname}
                            </span>
                            <span className="text-muted-foreground">
                                commented on {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                            <div className="ml-auto flex items-center gap-2">
                                {/* Close button in header */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                    onClick={handleCancelEdit}
                                    disabled={isUpdating}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>

                        {/* Editor Body */}
                        <div className="bg-background p-4">
                            <MarkdownEditor
                                value={editContent}
                                onChange={setEditContent}
                                minRows={4}
                                resizable
                                editorClassName="resize-y p-2"
                                footer={
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isUpdating}>
                                            Cancel
                                        </Button>
                                        <Button variant="default" size="sm" onClick={handleSaveEdit} disabled={isUpdating}>
                                            {isUpdating ? "Saving..." : "Update comment"}
                                        </Button>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <CommentBox
            author={{
                name: comment.author.nickname,
                avatarUrl: comment.author.profileImageUrl || undefined
            }}
            date={comment.createdAt}
            content={comment.content}
            type={isAuthor ? "ISSUE" : "COMMENT"}
            actions={
                isMyComment ? (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={handleEdit}
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                ) : null
            }
        />
    );
};
