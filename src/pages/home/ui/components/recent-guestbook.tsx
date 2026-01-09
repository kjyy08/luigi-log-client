import { useSuspenseQuery } from "@tanstack/react-query";
import { guestbookQueries } from "@/entities/guestbook/model/guestbook.queries";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

export const RecentGuestbook = () => {
    const { data: guestbooks } = useSuspenseQuery(guestbookQueries.list());

    if (!guestbooks || guestbooks.length === 0) return null;

    const recentGuestbooks = guestbooks.slice(0, 10);

    return (
        <div className="space-y-4">
            <h2 className="text-base font-semibold">Recent Guestbook</h2>
            <div className="flex flex-col gap-0 border-l border-border ml-2 pl-8 py-2 relative">
                {recentGuestbooks.map((entry) => (
                    <div key={entry.guestbookId} className="relative pb-8 last:pb-2">
                        <div className="absolute -left-12 -top-1.5 bg-background rounded-full p-1 border border-border">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={entry.author.profileImageUrl ?? undefined} alt={entry.author.nickname} />
                                <AvatarFallback>{entry.author.nickname[0]}</AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold text-foreground">
                                    {entry.author.nickname}
                                </span>
                                <span className="text-muted-foreground flex items-center gap-1">
                                    <span className="text-xs">@{entry.author.username}</span>
                                </span>
                                <span className="text-xs text-muted-foreground ml-auto">
                                    {new Date(entry.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="text-sm text-foreground/80 bg-muted/30 p-3 rounded-md border border-border mt-1 hover:border-muted-foreground/50 transition-colors whitespace-pre-wrap line-clamp-3">
                                {entry.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pl-6">
                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground" asChild>
                    <Link to="/guestbook" className="flex items-center gap-2">
                        View all entries <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                </Button>
            </div>
        </div>
    );
};
