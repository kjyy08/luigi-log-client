export interface ProfileResponse {
    profileId: string;
    memberId: string;
    nickname: string;
    bio: string;
    profileImageUrl: string;
    jobTitle: string;
    techStack: string[];
    contactEmail: string;
    websiteUrl: string;
    readme?: string;
    company?: string;
    location?: string;
    githubUrl?: string; // consolidated
}

export interface UpdateProfileRequest {
    nickname: string;
    bio: string;
    profileImageUrl: string;
    jobTitle: string;
    techStack: string[];
    githubUrl: string;
    contactEmail: string;
    websiteUrl: string;
    readme?: string;
    company?: string;
    location?: string;
}

export interface CommentActivity {
    id: string;
    content: string;
    postId: string;
    postTitle: string;
    author: string; // User who left the comment
    createdAt: string;
}
