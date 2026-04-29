export interface MarkdownHeading {
    id: string;
    level: number;
    text: string;
}

const normalizeHeadingText = (text: string) =>
    text
        .replace(/[`*_~[\]()#>]/g, "")
        .replace(/\s+/g, " ")
        .trim();

export const buildHeadingId = (text: string, usedIds: Map<string, number>) => {
    const base = normalizeHeadingText(text)
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
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

    for (const line of markdown.split(/\r?\n/)) {
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
        });
    }

    return headings;
};
