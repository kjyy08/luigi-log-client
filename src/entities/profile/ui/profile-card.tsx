import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Mail, MapPin, Link as LinkIcon, Building2, PenLine, Upload, Github } from "lucide-react";
import type { ProfileResponse } from "../model/profile.dto";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { publicApi } from "@/shared/lib";
import { updateMyProfile } from "../api/profile.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileKeys } from "../model/profile.queries";

interface ProfileCardProps {
    profile: ProfileResponse;
    isOwner?: boolean;
}

export const ProfileCard = ({
    profile,
    isOwner = false,
}: ProfileCardProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();
    // const navigate = useNavigate(); // Removed unused

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        nickname: profile.nickname,
        jobTitle: profile.jobTitle || '',
        bio: profile.bio || '',
        company: profile.company || '',
        location: profile.location || '',
        contactEmail: profile.contactEmail,
        websiteUrl: profile.websiteUrl,
        githubUrl: profile.githubUrl || '',
    });

    // Update local state when profile changes (e.g. after refetch)
    useEffect(() => {
        setEditForm({
            nickname: profile.nickname,
            jobTitle: profile.jobTitle || '',
            bio: profile.bio || '',
            company: profile.company || '',
            location: profile.location || '',
            contactEmail: profile.contactEmail,
            websiteUrl: profile.websiteUrl,
            githubUrl: profile.githubUrl || '',
        });
    }, [profile]);

    const updateProfileMutation = useMutation({
        mutationFn: updateMyProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: profileKeys.myProfile() });
            setIsEditing(false);
        },
    });

    const handleAvatarClick = () => {
        if (isOwner) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const uploadResponse = await publicApi.post('/api/v1/files', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const publicUrl = uploadResponse.data.data.publicUrl;

            updateProfileMutation.mutate({
                ...profile,
                profileImageUrl: publicUrl,
                githubUrl: profile.githubUrl || ''
            });
        } catch (error) {
            console.error("Failed to upload image:", error);
            alert("이미지 업로드에 실패했습니다.");
        }
    };

    const handleSave = () => {
        updateProfileMutation.mutate({
            ...profile,
            ...editForm,
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form to current profile values
        setEditForm({
            nickname: profile.nickname,
            jobTitle: profile.jobTitle || '',
            bio: profile.bio || '',
            company: profile.company || '',
            location: profile.location || '',
            contactEmail: profile.contactEmail,
            websiteUrl: profile.websiteUrl,
            githubUrl: profile.githubUrl || '',
        });
    };

    if (isEditing) {
        return (
            <div className="flex flex-col gap-4">
                <div className="relative group w-fit mx-auto md:mx-0">
                    <Avatar className="w-64 h-64 border-2 border-border rounded-full shadow-sm z-10 relative bg-background cursor-pointer hover:opacity-90 transition-opacity" onClick={handleAvatarClick}>
                        <AvatarImage src={profile.profileImageUrl} alt={profile.nickname} />
                        <AvatarFallback className="text-4xl">{profile.nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-background rounded-full border border-border flex items-center justify-center shadow-md z-20 cursor-pointer text-luigi-green">
                        <Upload className="w-5 h-5" />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Name</label>
                        <Input
                            value={editForm.nickname}
                            onChange={(e) => setEditForm(prev => ({ ...prev, nickname: e.target.value }))}
                            className="font-bold text-lg"
                        />
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground">Job Title</label>
                            <Input
                                value={editForm.jobTitle}
                                onChange={(e) => setEditForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                                className="text-muted-foreground h-8"
                                placeholder="Job Title (e.g. Frontend Developer)"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Bio</label>
                        <Textarea
                            value={editForm.bio}
                            onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                            rows={3}
                            className="text-base"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Company</label>
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <Input
                                value={editForm.company}
                                onChange={(e) => setEditForm(prev => ({ ...prev, company: e.target.value }))}
                                placeholder="Company"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Location</label>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <Input
                                value={editForm.location}
                                onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="Location"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Website</label>
                        <div className="flex items-center gap-2">
                            <LinkIcon className="w-4 h-4 text-muted-foreground" />
                            <Input
                                value={editForm.websiteUrl}
                                onChange={(e) => setEditForm(prev => ({ ...prev, websiteUrl: e.target.value }))}
                                placeholder="https://example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">GitHub</label>
                        <div className="flex items-center gap-2">
                            <Github className="w-4 h-4 text-muted-foreground" />
                            <Input
                                value={editForm.githubUrl}
                                onChange={(e) => setEditForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                                placeholder="https://github.com/username"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                        <Button className="flex-1 bg-luigi-green hover:bg-luigi-green/90 text-white" onClick={handleSave}>
                            Save
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="relative group w-fit mx-auto md:mx-0">
                <Avatar
                    className={`w-64 h-64 border-2 border-border rounded-full shadow-sm z-10 relative bg-background ${isOwner ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
                    onClick={handleAvatarClick}
                >
                    <AvatarImage src={profile.profileImageUrl} alt={profile.nickname} />
                    <AvatarFallback className="text-4xl">{profile.nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>

                {isOwner && (
                    <>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <div
                            className="absolute bottom-4 right-4 w-10 h-10 bg-background rounded-full border border-border flex items-center justify-center shadow-md z-20 cursor-pointer hover:text-luigi-green transition-colors opacity-0 group-hover:opacity-100"
                            onClick={handleAvatarClick}
                        >
                            <Upload className="w-5 h-5" />
                        </div>
                    </>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold leading-none">{profile.nickname}</h1>
                <span className="text-xl text-muted-foreground font-light">{profile.jobTitle || 'Developer'}</span>
            </div>

            {profile.bio && <p className="text-base leading-relaxed whitespace-pre-line">{profile.bio}</p>}

            {isOwner && (
                <Button
                    variant="outline"
                    className="w-full font-semibold border-border hover:bg-accent my-2 transition-colors"
                    onClick={() => setIsEditing(true)}
                >
                    <PenLine className="w-4 h-4 mr-2" />
                    프로필 수정
                </Button>
            )}

            <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-2">
                {profile.company && (
                    <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{profile.company}</span>
                    </div>
                )}
                {profile.location && (
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                    </div>
                )}
                {profile.contactEmail && (
                    <div className="flex items-center gap-2 hover:text-luigi-green transition-colors cursor-pointer">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${profile.contactEmail}`}>{profile.contactEmail}</a>
                    </div>
                )}
                {profile.websiteUrl && (
                    <div className="flex items-center gap-2 hover:text-luigi-green transition-colors cursor-pointer">
                        <LinkIcon className="w-4 h-4" />
                        <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer">{profile.websiteUrl}</a>
                    </div>
                )}
                {profile.githubUrl && (
                    <div className="flex items-center gap-2 hover:text-luigi-green transition-colors cursor-pointer">
                        <Github className="w-4 h-4" />
                        <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">{profile.githubUrl}</a>
                    </div>
                )}
            </div>
        </div>
    );
};
