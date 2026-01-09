import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { PenLine, Save, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyProfile } from "@/entities/profile/api/profile.api";
import { profileKeys } from "@/entities/profile/model/profile.queries";
import { ProfileResponse } from "@/entities/profile/model/profile.dto";

interface ProfileReadmeProps {
    username: string;
    content?: string;
    isOwner?: boolean;
    // We need the full profile object to update it, or at least the fields required by updateMyProfile.
    // However, updateMyProfile requires UpdateProfileRequest which is mostly ProfileResponse.
    // Ideally ProfileReadme should just take an onSave callback, but for speed we'll do data fetching logic here or assume parent revalidates.
    // Better: Receive the profile object or onUpdate.
    // Let's rely on useMutation here and assume we can patch the readme. 
    // BUT updateMyProfile expects a full object usually in PUT. 
    // Let's assume we can fetch the current profile to merge, or we pass profile as prop.
    // For now, let's update ProfileReadme to accept the full 'profile' object instead of just content.
    profile?: ProfileResponse;
}

export const ProfileReadme = ({ username, content, isOwner = false, profile }: ProfileReadmeProps) => {
    // If no content and not owner, hide. If owner, show empty state or edit button.
    if (!content && !isOwner) return null;

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(content || '');
    const queryClient = useQueryClient();

    useEffect(() => {
        setEditContent(content || '');
    }, [content]);

    const updateProfileMutation = useMutation({
        mutationFn: updateMyProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: profileKeys.profile(username) });
            queryClient.invalidateQueries({ queryKey: profileKeys.myProfile() });
            setIsEditing(false);
        },
    });

    const handleSave = () => {
        if (!profile) return; // Should not happen if isOwner is true and valid profile passed
        updateProfileMutation.mutate({
            ...profile,
            readme: editContent,
            githubUrl: profile.githubUrl || ''
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditContent(content || '');
    };

    return (
        <div className="border border-border rounded-lg bg-card overflow-hidden mb-8">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{username}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="font-medium">README.md</span>
                </div>
                {isOwner && !isEditing && (
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setIsEditing(true)}>
                        <PenLine className="w-3.5 h-3.5" />
                        <span className="sr-only">Edit README</span>
                    </Button>
                )}
                {isOwner && isEditing && (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500 hover:text-red-600" onClick={handleCancel}>
                            <X className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-luigi-green hover:text-luigi-green/90" onClick={handleSave}>
                            <Save className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
            <div className="p-6 md:p-8">
                {isEditing ? (
                    <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[300px] font-mono text-sm"
                        placeholder="Share something about yourself..."
                    />
                ) : (
                    <div className="prose dark:prose-invert max-w-none prose-sm md:prose-base prose-headings:border-b prose-headings:border-border prose-headings:pb-2 prose-headings:mt-6 first:prose-headings:mt-0 prose-pre:bg-muted prose-pre:border prose-pre:border-border">
                        <ReactMarkdown>{content || '*No description provided.*'}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
};
