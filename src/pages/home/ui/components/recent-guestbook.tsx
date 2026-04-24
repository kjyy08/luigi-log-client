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
        <div className="min-w-0 space-y-4">
            <h2 className="text-base font-semibold">Recent Guestbook</h2>
            <div className="relative ml-5 flex min-w-0 flex-col gap-0 border-l border-border py-2 pl-5 sm:ml-2 sm:pl-8">
                {recentGuestbooks.map((entry) => (
                    <div key={entry.guestbookId} className="relative pb-8 last:pb-2">
                        <div className="absolute -left-9 -top-1.5 bg-background rounded-full p-1 border border-border sm:-left-12">
                            <Avatar className="h-6 w-6 shrink-0">
                                <AvatarImage src={entry.author.profileImageUrl ?? undefined} alt={entry.author.nickname} />
                                <AvatarFallback>{entry.author.nickname[0]}</AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex min-w-0 flex-col gap-1">
                            <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm">
                                <span className="font-semibold text-foreground truncate">
                                    {entry.author.nickname}
                                </span>
                                <span className="text-muted-foreground flex min-w-0 items-center gap-1">
                                    <span className="truncate text-xs">@{entry.author.username}</span>
                                </span>
                                <span className="ml-0 text-xs text-muted-foreground sm:ml-auto">
                                    {new Date(entry.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="mt-1 min-w-0 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/30 p-3 text-sm text-foreground/80 transition-colors line-clamp-3 hover:border-muted-foreground/50">
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
