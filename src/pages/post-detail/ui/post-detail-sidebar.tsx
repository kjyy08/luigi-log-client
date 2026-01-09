import { User, Folder } from "lucide-react";

interface PostDetailSidebarProps {
    author: {
        nickname: string;
        profileImageUrl?: string;
    };
    tags: string[];
    type: string;
}

export const PostDetailSidebar = ({ author, tags, type }: PostDetailSidebarProps) => {
    return (
        <aside className="space-y-6 md:pl-4">
            <SidebarSection title="Assignees">
                <div className="flex items-center gap-2 text-sm text-foreground group cursor-pointer hover:text-luigi-green">
                    <div className="w-5 h-5 rounded-full overflow-hidden border">
                        {author.profileImageUrl ? (
                            <img src={author.profileImageUrl} alt={author.nickname} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <User className="h-3 w-3 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <span className="font-medium">{author.nickname}</span>
                </div>
            </SidebarSection>

            <SidebarSection title="Labels">
                {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                        {tags.map(tag => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border hover:border-foreground/20 transition-colors cursor-pointer"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-sm text-muted-foreground">None yet</span>
                )}
            </SidebarSection>

            <SidebarSection title="Projects">
                <div className="flex items-center gap-2 text-sm text-foreground">
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    <span>{type}</span>
                </div>
            </SidebarSection>

            <SidebarSection title="Milestone">
                <span className="text-sm text-muted-foreground hover:text-luigi-green cursor-pointer">
                    No milestone
                </span>
            </SidebarSection>
        </aside>
    );
};

const SidebarSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
    return (
        <div className="border-b pb-4 space-y-2 last:border-0">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center justify-between group-hover:text-foreground cursor-pointer hover:text-luigi-green transition-colors">
                {title}
                <SettingsIcon className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <div>{children}</div>
        </div>
    );
};

const SettingsIcon = (props: React.ComponentProps<"svg">) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
)
