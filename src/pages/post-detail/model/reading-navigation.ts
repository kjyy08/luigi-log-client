export interface MarkdownHeading {
    id: string;
    level: number;
    text: string;
    line?: number;
}

export interface HeadingPosition {
    id: string;
    top: number;
}

const DEFAULT_ACTIVE_OFFSET = 112;

export const normalizeHeadingText = (text: string) =>
    text
        .replace(/[`*_~[\]()#>]/g, "")
        .replace(/\s+/g, " ")
        .trim();

const buildHeadingMatchKey = (level: number, text: string) => `${level}:${normalizeHeadingText(text)}`;

export const buildHeadingId = (text: string, usedIds: Map<string, number>) => {
    const base = normalizeHeadingText(text)
        .toLowerCase()
        .normalize("NFKC")
        .replace(/[^a-z0-9가-힣]+/g, "-")
        .replace(/^-+|-+$/g, "") || "section";

    const count = (usedIds.get(base) ?? 0) + 1;
    usedIds.set(base, count);

    return count === 1 ? base : `${base}-${count}`;
};

export const extractMarkdownHeadings = (markdown: string): MarkdownHeading[] => {
    const usedIds = new Map<string, number>();
    const headings: MarkdownHeading[] = [];
    let inFence = false;

    const lines = markdown.split(/\r?\n/);

    for (const [index, line] of lines.entries()) {
        if (/^\s*```/.test(line) || /^\s*~~~/.test(line)) {
            inFence = !inFence;
            continue;
        }

        if (inFence) continue;

        const match = /^(#{1,4})\s+(.+?)\s*#*\s*$/.exec(line);
        if (!match) continue;

        const text = normalizeHeadingText(match[2]);
        if (!text) continue;

        headings.push({
            id: buildHeadingId(text, usedIds),
            level: match[1].length,
            text,
            line: index + 1,
        });
    }

    return headings;
};

export const createMarkdownHeadingIdResolver = (headings: MarkdownHeading[]) => {
    const idsByHeading = new Map<string, string[]>();
    const idBySourceLine = new Map<string, string>();

    for (const heading of headings) {
        const key = buildHeadingMatchKey(heading.level, heading.text);
        idsByHeading.set(key, [...(idsByHeading.get(key) ?? []), heading.id]);

        if (typeof heading.line === "number") {
            idBySourceLine.set(`${heading.line}:${key}`, heading.id);
        }
    }

    return (level: number, text: string, line?: number) => {
        const key = buildHeadingMatchKey(level, text);

        if (typeof line === "number") {
            const id = idBySourceLine.get(`${line}:${key}`);
            if (id) return id;
        }

        const ids = idsByHeading.get(key);
        const id = ids?.shift();

        if (ids?.length === 0) {
            idsByHeading.delete(key);
        }

        return id;
    };
};

export const getActiveHeadingId = (
    headings: MarkdownHeading[],
    positions: HeadingPosition[],
    activeOffset = DEFAULT_ACTIVE_OFFSET,
) => {
    const positionById = new Map(positions.map((position) => [position.id, position.top]));
    const measuredHeadings = headings
        .map((heading) => ({ ...heading, top: positionById.get(heading.id) }))
        .filter((heading): heading is MarkdownHeading & { top: number } => typeof heading.top === "number");

    if (measuredHeadings.length === 0) return headings[0]?.id ?? "";

    const firstBelowOffset = measuredHeadings.find((heading) => heading.top > activeOffset);
    if (firstBelowOffset === measuredHeadings[0]) return measuredHeadings[0].id;

    const activeHeading = [...measuredHeadings]
        .reverse()
        .find((heading) => heading.top <= activeOffset);

    return activeHeading?.id ?? measuredHeadings[0].id;
};

const getNearestParentH2Index = (headings: MarkdownHeading[], index: number) => {
    for (let cursor = index; cursor >= 0; cursor -= 1) {
        if (headings[cursor]?.level === 2) return cursor;
    }

    return -1;
};

export const getVisibleTocHeadingIds = (headings: MarkdownHeading[], activeId: string) => {
    if (headings.length === 0) return [];

    const activeIndex = Math.max(
        0,
        headings.findIndex((heading) => heading.id === activeId),
    );
    const activeParentH2Index = getNearestParentH2Index(headings, activeIndex);

    return headings
        .filter((heading, index) => {
            if (heading.level <= 2) return true;

            if (activeParentH2Index >= 0) {
                return getNearestParentH2Index(headings, index) === activeParentH2Index;
            }

            return index <= activeIndex;
        })
        .map((heading) => heading.id);
};
