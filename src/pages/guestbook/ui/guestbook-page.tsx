
import { GuestbookItem } from "@/entities/guestbook/ui/guestbook-item";
import { PageHeader } from "@/shared/ui/page-header";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GuestbookInput } from "@/features/guestbook";
import React from "react";
import { GuestbookSkeleton } from "./guestbook-skeleton";
import { guestbookQueries } from "@/entities/guestbook/model/guestbook.queries";

const GuestbookList = () => {
    const { data: entries } = useSuspenseQuery(guestbookQueries.list());

    return (
        <div className="space-y-6 p-4">
            {entries.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                    첫 번째 방명록을 남겨보세요!
                </div>
            ) : (
                entries.map((entry) => (
                    <GuestbookItem key={entry.guestbookId} entry={entry} />
                ))
            )}
        </div>
    );
};

export const GuestbookPage = () => {
    return (
        <div className="container max-w-4xl mx-auto py-10 animate-fade-in">
            <PageHeader
                title="방명록"
                description="자유롭게 방명록을 남겨주세요."
            />

            <div className="mt-8">
                <GuestbookInput />

                <div className="mb-6 border-b border-border pb-4">
                    {/* We can fetch total count if API provides it, or just show list count */}
                    {/* <span className="font-semibold text-sm">Guestbooks</span> */}
                </div>

                <React.Suspense fallback={<GuestbookSkeleton />}>
                    <GuestbookList />
                </React.Suspense>
            </div>
        </div>
    );
};
