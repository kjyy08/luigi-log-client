import { useEffect, useState } from "react";
import type { MarkdownHeading } from "../model/reading-navigation";
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
        if (!shouldShowToc) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

                if (visible?.target.id) {
                    setActiveId(visible.target.id);
                }
            },
            {
                rootMargin: "-20% 0px -65% 0px",
                threshold: [0, 1],
            },
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings, shouldShowToc]);

    if (!shouldShowToc) return null;

    return (
        <nav
            className="hidden rounded-xl border border-border/80 bg-background/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03] lg:block"
            aria-label="On this page"
        >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                On this page
            </p>
            <ol className="space-y-1.5 border-l border-border/80 dark:border-white/10">
                {headings.map((heading) => (
                    <li key={heading.id}>
                        <a
                            href={`#${heading.id}`}
                            className={cn(
                                "block rounded-r-md border-l-2 border-transparent py-1.5 pr-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                heading.level > 2 ? "pl-6 text-xs" : "pl-3",
                                activeId === heading.id && "border-primary bg-primary/10 text-foreground dark:bg-primary/15",
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
