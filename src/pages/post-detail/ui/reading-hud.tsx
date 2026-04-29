import { useEffect, useState } from "react";
import { getActiveHeadingId, type MarkdownHeading } from "../model/reading-navigation";
import { cn } from "@/shared/lib/utils";

interface ReadingHudProps {
    headings: MarkdownHeading[];
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

export const ReadingHud = ({ headings }: ReadingHudProps) => {
    const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
    const shouldShowToc = headings.length >= 2;

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

    if (!shouldShowToc) return null;

    return (
        <nav
            className="hidden border-b border-border pb-4 md:pl-4 lg:block"
            aria-label="On this page"
        >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                On this page
            </p>
            <ol className="space-y-1 border-l border-border/80 dark:border-white/10">
                {headings.map((heading) => (
                    <li key={heading.id}>
                        <a
                            href={`#${heading.id}`}
                            onClick={() => setActiveId(heading.id)}
                            className={cn(
                                "block rounded-r-md border-l-2 border-transparent py-1 pr-2 text-xs text-muted-foreground transition-colors hover:border-luigi-green/50 hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                heading.level > 2 ? "pl-5" : "pl-3",
                                activeId === heading.id && "border-luigi-green bg-muted/60 text-foreground",
                            )}
                        >
                            <span className="line-clamp-2">{heading.text}</span>
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
};
