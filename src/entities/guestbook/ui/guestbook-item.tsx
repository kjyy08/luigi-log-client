import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { useDeleteGuestbook, useUpdateGuestbook } from "../model/guestbook.queries";
import type { GuestbookEntry } from "../model/guestbook.dto";
import { Trash2, Pencil, X } from "lucide-react";
import { MarkdownView } from "@/shared/ui/markdown-view";
import TextareaAutosize from "react-textarea-autosize";
import { useState } from "react";

interface GuestbookItemProps {
    entry: GuestbookEntry;
}

export const GuestbookItem = ({ entry }: GuestbookItemProps) => {
    const { member } = useAuthStore();
    const { mutate: deleteGuestbook } = useDeleteGuestbook();
    const { mutate: updateGuestbook, isPending: isUpdating } = useUpdateGuestbook();

    // Check if the current user is the author
    const isAuthor = member?.memberId === entry.author.memberId;

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(entry.content);

    const handleDelete = () => {
        if (confirm("정말로 삭제하시겠습니까?")) {
            deleteGuestbook(entry.guestbookId);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditContent(entry.content);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditContent(entry.content);
    };

    const handleSaveEdit = () => {
        if (!editContent.trim()) return;
        updateGuestbook(
            { id: entry.guestbookId, data: { content: editContent } },
            {
                onSuccess: () => {
                    setIsEditing(false);
                },
            }
        );
    };

    return (
        <div className="flex gap-4 group relative">
            <div className="hidden sm:block">
                <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={entry.author.profileImageUrl ?? undefined} alt={entry.author.nickname} />
                    <AvatarFallback>{entry.author.nickname[0]}</AvatarFallback>
                </Avatar>
            </div>

            <div className="flex-1 min-w-0 bg-card border border-border rounded-md shadow-sm relative">


                <div className="flex items-center gap-2 bg-muted/40 border-b border-border px-4 py-2 rounded-t-md text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{entry.author.nickname}</span>
                    <span className="text-muted-foreground">@{entry.author.username}</span>
                    <span>· {new Date(entry.createdAt).toLocaleDateString()}</span>

                    <div className="ml-auto flex items-center gap-2">
                        {isAuthor && !isEditing && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                    onClick={handleEdit}
                                >
                                    <Pencil className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </>
                        )}
                        {isEditing && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="p-4 text-sm leading-relaxed text-card-foreground">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="rounded-md border border-border bg-background overflow-hidden">
                                <TextareaAutosize
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full resize-none border-0 bg-transparent p-3 placeholder:text-muted-foreground/50 focus:ring-0 text-sm leading-relaxed min-h-[100px]"
                                    disabled={isUpdating}
                                />

                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isUpdating}>
                                    취소
                                </Button>
                                <Button variant="default" size="sm" onClick={handleSaveEdit} disabled={isUpdating}>
                                    {isUpdating ? "저장 중..." : "저장"}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none text-sm prose-p:my-0 prose-headings:my-1 prose-ul:my-0 prose-ol:my-0 prose-pre:my-0 prose-blockquote:my-1">
                            <MarkdownView content={entry.content} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

