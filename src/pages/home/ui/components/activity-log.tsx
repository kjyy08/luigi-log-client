import { GitCommit, GitPullRequest, GitMerge, Star } from "lucide-react";
import { Link } from "react-router-dom";

export const ActivityLog = () => {
    const activities = [
        { id: 1, type: "push", repo: "kjyy08/luigi-log-client", time: "2시간 전", desc: "2개의 브랜치에 3개의 커밋 푸시" },
        { id: 2, type: "pr", repo: "kjyy08/luigi-log-client", time: "5시간 전", desc: "PR #12: GitHub 테마 기능 구현" },
        { id: 3, type: "star", repo: "facebook/react", time: "1일 전", desc: "facebook/react 저장소 스타" },
        { id: 4, type: "create", repo: "kjyy08/game-engine", time: "3일 전", desc: "kjyy08/game-engine 저장소 생성" },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case "push": return <GitCommit className="w-4 h-4" />;
            case "pr": return <GitPullRequest className="w-4 h-4" />;
            case "star": return <Star className="w-4 h-4" />;
            case "create": return <GitMerge className="w-4 h-4" />; // Placeholder
            default: return <GitCommit className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-base font-semibold">기여 활동</h2>
            <div className="relative border-l-2 border-border ml-2 space-y-6 pb-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="relative pl-6">
                        <div className="absolute -left-[9px] top-1 bg-background p-1 rounded-full border border-border text-muted-foreground">
                            {getIcon(activity.type)}
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm text-foreground">
                                <span className="font-semibold text-muted-foreground uppercase text-xs">{activity.type}</span>
                                <span className="text-muted-foreground text-xs">{activity.time}</span>
                            </div>
                            <div className="text-sm">
                                {activity.desc}{" "}
                                <Link to="#" className="font-semibold text-luigi-blue hover:underline">
                                    {activity.repo}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full text-center">
                <button className="text-xs text-luigi-blue hover:underline font-semibold w-full py-2 border-t border-border mt-2">
                    더 보기
                </button>
            </div>
        </div>
    );
};
