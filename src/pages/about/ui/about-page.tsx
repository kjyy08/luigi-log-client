import { Button } from "@/shared/ui/button";
import { Link } from "react-router-dom";
import { Github, Mail, Globe, Code, Loader2, User } from "lucide-react";
import { useGetProfile } from "@/entities/profile/model/profile.queries";
import { BLOG_OWNER_USERNAME } from "@/shared/config";

export const AboutPage = () => {
    const { data: profile, isLoading, isError } = useGetProfile(BLOG_OWNER_USERNAME);

    if (isLoading) {
        return <AboutPageSkeleton />;
    }

    if (isError || !profile) {
        return (
            <div className="container max-max-4xl py-20 text-center space-y-4">
                <h1 className="text-2xl font-bold">프로필을 불러오지 못했습니다.</h1>
                <p className="text-muted-foreground">로그인이 필요하거나 프로필 정보가 아직 설정되지 않았을 수 있습니다.</p>
                <Button asChild className="bg-luigi-green hover:bg-luigi-green/90 text-white">
                    <Link to="/">홈으로 돌아가기</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl py-12 space-y-16 animate-fade-in">
            {/* Hero Section */}
            <section className="flex flex-col md:flex-row items-center gap-10">
                <div className="w-48 h-48 rounded-full border-4 border-luigi-green p-1 group overflow-hidden bg-background">
                    <img
                        src={profile.profileImageUrl || "/avatars/luigi.png"}
                        alt={profile.nickname}
                        className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${profile.nickname}&background=33a852&color=fff&size=200`;
                        }}
                    />
                </div>
                <div className="text-center md:text-left space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight">
                        Hi, I'm <span className="text-luigi-green">{profile.nickname}</span>! 🍄
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {profile.jobTitle || "모험을 즐기는 개발자"}
                    </p>
                    <div className="flex justify-center md:justify-start gap-4">
                        {profile.githubUrl && (
                            <Button variant="ghost" size="icon" asChild>
                                <a href={profile.githubUrl} target="_blank" rel="noreferrer"><Github className="w-5 h-5" /></a>
                            </Button>
                        )}
                        {profile.contactEmail && (
                            <Button variant="ghost" size="icon" asChild>
                                <a href={`mailto:${profile.contactEmail}`}><Mail className="w-5 h-5" /></a>
                            </Button>
                        )}
                        {profile.websiteUrl && (
                            <Button variant="ghost" size="icon" asChild>
                                <a href={profile.websiteUrl} target="_blank" rel="noreferrer"><Globe className="w-5 h-5" /></a>
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            {profile.techStack && profile.techStack.length > 0 && (
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Code className="w-6 h-6 text-luigi-green" />
                        My Tech Stack
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {profile.techStack.map(tech => (
                            <span key={tech} className="px-4 py-2 rounded-full bg-background border-2 border-luigi-green/20 text-sm font-semibold hover:border-luigi-green transition-colors select-none">
                                {tech}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* About Me Section (Markdown) */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <User className="w-6 h-6 text-luigi-green" />
                    About Me
                </h2>
                <div className="bg-card rounded-xl p-6 border shadow-sm">
                    <MarkdownView content={profile.bio || "아직 자기소개가 없습니다."} />
                </div>
            </section>
        </div>
    );
};
