import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

import { useAuthStore } from "@/entities/auth/model/auth.store";
import { useGetMyProfile } from "@/entities/profile/model/profile.queries";

import TextareaAutosize from "react-textarea-autosize";
import { useState } from "react";
import { useCreateGuestbook } from "@/entities/guestbook/model/guestbook.queries";
import { useUIStore } from "@/shared/store/use-ui-store";

export const GuestbookInput = () => {
    const { isAuthenticated, member, profile: storeProfile } = useAuthStore();
    const { openLoginModal } = useUIStore();
    const { data: profileQueryData } = useGetMyProfile(member?.username, { enabled: isAuthenticated && !!member?.username });
    const profile = profileQueryData || storeProfile;
    const [content, setContent] = useState("");
    const { mutate: createGuestbook, isPending } = useCreateGuestbook();

    const avatarUrl = profile?.profileImageUrl ?? null;
    const username = profile?.nickname ?? member?.username ?? "Anonymous";

    const handleSubmit = () => {
        if (!content.trim()) return;
        createGuestbook(
            { content },
            {
                onSuccess: () => {
                    setContent("");
                },
            }
        );
    };

    return (
        <div className="flex gap-4 mb-8">
            <div className="hidden sm:block">
                <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={avatarUrl ?? undefined} alt={username} />
                    <AvatarFallback>{username[0]}</AvatarFallback>
                </Avatar>
            </div>

            <div className="flex-1 min-w-0 relative">
                <div className="relative rounded-md shadow-sm">
                    <div className="overflow-hidden rounded-md border border-border bg-background transition-all">
                        <TextareaAutosize
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Leave a message."
                            minRows={3}
                            disabled={!isAuthenticated || isPending}
                            className="w-full resize-none border-0 bg-transparent p-4 placeholder:text-muted-foreground/50 focus:ring-0 text-sm leading-relaxed"
                        />
                        {isAuthenticated && (
                            <div className="flex items-center justify-end border-t bg-muted/20 p-2">
                                <Button
                                    size="sm"
                                    className="bg-luigi-green hover:bg-luigi-green/90 text-white font-semibold h-8"
                                    disabled={!content.trim() || isPending}
                                    onClick={handleSubmit}
                                >
                                    {isPending ? "Posting..." : "Sign Guestbook"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {!isAuthenticated && (
                    <div className="absolute inset-x-2 top-12 bottom-12 bg-background/10 backdrop-blur-[1px] flex items-center justify-center rounded-md z-10 pointer-events-none">
                        {/* Spacer for overlay */}
                    </div>
                )}

                {!isAuthenticated && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div className="pointer-events-auto">
                            <button
                                type="button"
                                onClick={openLoginModal}
                                className="text-sm font-medium text-white bg-luigi-green hover:bg-luigi-green/90 px-4 py-2 rounded shadow-sm border border-transparent transition-colors"
                            >
                                Sign in to Guestbook
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
