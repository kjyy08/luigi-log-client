import { useEffect, useMemo, useRef, useState } from "react";
import {
    getActiveHeadingId,
    getVisibleTocHeadingIds,
    type MarkdownHeading,
} from "../model/reading-navigation";
import { cn } from "@/shared/lib/utils";

interface ReadingHudProps {
    headings: MarkdownHeading[];
}

interface TocScrollState {
    canScrollUp: boolean;
    canScrollDown: boolean;
}

const getScrollProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollable <= 0) return 0;

    return Math.min(100, Math.max(0, (scrollTop / scrollable) * 100));
};

export const ReadingProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => setProgress(getScrollProgress());

        updateProgress();
        window.addEventListener("scroll", updateProgress, { passive: true });
        window.addEventListener("resize", updateProgress);

        return () => {
            window.removeEventListener("scroll", updateProgress);
            window.removeEventListener("resize", updateProgress);
        };
    }, []);

    return (
        <div className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent" aria-hidden="true">
            <div
                className="h-full bg-primary/80 transition-[width] duration-150 ease-out dark:bg-primary"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

const getTocIndentClassName = (level: number) => {
    if (level >= 4) return "pl-8";
    if (level === 3) return "pl-6";
    return "pl-3";
};

export const ReadingHud = ({ headings }: ReadingHudProps) => {
    const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
    const [tocScrollState, setTocScrollState] = useState<TocScrollState>({
        canScrollUp: false,
        canScrollDown: false,
    });
    const tocListRef = useRef<HTMLOListElement>(null);
    const activeItemRef = useRef<HTMLAnchorElement | null>(null);
    const shouldShowToc = headings.length >= 2;
    const visibleHeadingIds = useMemo(
        () => new Set(getVisibleTocHeadingIds(headings, activeId)),
        [headings, activeId],
    );

    useEffect(() => {
        setActiveId(headings[0]?.id ?? "");
    }, [headings]);

    useEffect(() => {
        if (!shouldShowToc) return;

        const updateActiveHeading = () => {
            const positions = headings.map((heading) => ({
                id: heading.id,
                top: document.getElementById(heading.id)?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY,
            }));

            setActiveId(getActiveHeadingId(headings, positions));
        };

        updateActiveHeading();
        window.addEventListener("scroll", updateActiveHeading, { passive: true });
        window.addEventListener("resize", updateActiveHeading);

        return () => {
            window.removeEventListener("scroll", updateActiveHeading);
            window.removeEventListener("resize", updateActiveHeading);
        };
    }, [headings, shouldShowToc]);

    useEffect(() => {
        const tocList = tocListRef.current;
        if (!tocList || !shouldShowToc) return;

        const updateTocScrollState = () => {
            const { scrollTop, scrollHeight, clientHeight } = tocList;
            setTocScrollState({
                canScrollUp: scrollTop > 4,
                canScrollDown: scrollTop + clientHeight < scrollHeight - 4,
            });
        };

        updateTocScrollState();
        tocList.addEventListener("scroll", updateTocScrollState, { passive: true });
        window.addEventListener("resize", updateTocScrollState);

        return () => {
            tocList.removeEventListener("scroll", updateTocScrollState);
            window.removeEventListener("resize", updateTocScrollState);
        };
    }, [shouldShowToc, visibleHeadingIds]);

    useEffect(() => {
        activeItemRef.current?.scrollIntoView({ block: "nearest" });
    }, [activeId, visibleHeadingIds]);

    if (!shouldShowToc) return null;

    return (
        <nav
            className="hidden min-h-0 border-b border-border pb-4 md:pl-4 lg:flex lg:flex-1 lg:flex-col"
            aria-label="On this page"
        >
            <p className="mb-2 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                On this page
            </p>
            <div className="relative min-h-0">
                <ol
                    ref={tocListRef}
                    className="max-h-[min(26rem,calc(100vh-22rem))] min-h-0 space-y-1 overflow-y-auto border-l border-border/80 pr-1 scrollbar-thin dark:border-white/10"
                >
                    {headings.map((heading) => {
                        const isVisible = visibleHeadingIds.has(heading.id);
                        const isActive = activeId === heading.id;

                        return (
                            <li key={heading.id} className={cn(!isVisible && "hidden")}>
                                <a
                                    ref={isActive ? activeItemRef : undefined}
                                    href={`#${heading.id}`}
                                    onClick={() => setActiveId(heading.id)}
                                    className={cn(
                                        "block rounded-r-md border-l-2 border-transparent py-1 pr-2 text-xs text-muted-foreground transition-colors hover:border-luigi-green/50 hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                        getTocIndentClassName(heading.level),
                                        isActive && "border-luigi-green bg-muted/60 text-foreground",
                                    )}
                                >
                                    <span className="line-clamp-2">{heading.text}</span>
                                </a>
                            </li>
                        );
                    })}
                </ol>
                <div
                    className={cn(
                        "pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-background to-transparent opacity-0 transition-opacity",
                        tocScrollState.canScrollUp && "opacity-100",
                    )}
                    aria-hidden="true"
                />
                <div
                    className={cn(
                        "pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-background to-transparent opacity-0 transition-opacity",
                        tocScrollState.canScrollDown && "opacity-100",
                    )}
                    aria-hidden="true"
                />
            </div>
        </nav>
    );
};
