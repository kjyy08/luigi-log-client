export interface ProfileResponse {
    profileId: string;
    memberId: string;
    nickname: string;
    bio: string;
    profileImageUrl: string;
    jobTitle: string;
    techStack: string[];
    githubUrl: string;
    contactEmail: string;
    websiteUrl: string;
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
}
