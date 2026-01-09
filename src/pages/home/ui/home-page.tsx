import { ProfileCard } from "@/entities/profile/ui/profile-card";
import { RecentPostList } from "./components/recent-post-list";
import { PostContributionGraph } from "./components/post-contribution-graph";
import { Suspense } from "react";
import { HomeSkeleton } from "./home-skeleton";
import { useGetProfile } from "@/entities/profile/model/profile.queries";
import { ProfileReadme } from "./components/profile-readme";
import { RecentGuestbook } from "./components/recent-guestbook";
import { BLOG_OWNER_USERNAME } from "@/shared/config";
import { useAuthStore } from "@/entities/auth/model/auth.store";

export const HomePage = () => {
    const { data: profile } = useGetProfile(BLOG_OWNER_USERNAME);
    const { member } = useAuthStore();
    const isOwner = member?.username === BLOG_OWNER_USERNAME;

    if (!profile) return <HomeSkeleton />;

    return (
        <Suspense fallback={<HomeSkeleton />}>
            <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Sidebar (Profile) - 30%ish */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <ProfileCard
                            profile={profile}
                            isOwner={isOwner}
                        />
                    </div>

                    {/* Right Content - 70%ish */}
                    <div className="md:col-span-8 lg:col-span-9 space-y-8">
                        {/* Readme Section (Overview) */}
                        <ProfileReadme
                            username={profile.nickname}
                            content={profile.readme}
                            isOwner={isOwner}
                            profile={profile}
                        />

                        <RecentPostList />

                        <div className="space-y-8">
                            <PostContributionGraph />
                            <RecentGuestbook />
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
};
