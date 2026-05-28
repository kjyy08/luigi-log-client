export const SITE_ORIGIN = "https://blog.luigi99.cloud";
export const SITE_NAME = "Luigi Log";
export const DEFAULT_DESCRIPTION = "It's Me! Luigi";
export const DEFAULT_OG_IMAGE_PATH = "/web-app-manifest-512x512.png";

export interface SeoMetadata {
    title: string;
    description: string;
    url: string;
    image: string;
    siteName: string;
    type: "website" | "article";
    twitterCard: "summary_large_image";
    tags?: string[];
    publishedTime?: string;
    modifiedTime?: string;
}

interface DefaultMetadataInput {
    path?: string;
    title?: string;
    description?: string;
}

export const buildCanonicalUrl = (path = "/") => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return new URL(normalizedPath, SITE_ORIGIN).toString();
};

export const buildAssetUrl = (path: string) => buildCanonicalUrl(path);

export const extractPlainTextDescription = (markdown = "", maxLength = 160) => {
    const plainText = markdown
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/[*_~>#-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (!plainText) return DEFAULT_DESCRIPTION;
    if (plainText.length <= maxLength) return plainText;

    const truncated = plainText.slice(0, maxLength - 1).trimEnd();
    const lastSpace = truncated.lastIndexOf(" ");
    return `${lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated}…`;
};

export const buildDefaultMetadata = ({
    path = "/",
    title = SITE_NAME,
    description = DEFAULT_DESCRIPTION,
}: DefaultMetadataInput = {}): SeoMetadata => ({
    title,
    description,
    url: buildCanonicalUrl(path),
    image: buildAssetUrl(DEFAULT_OG_IMAGE_PATH),
    siteName: SITE_NAME,
    type: "website",
    twitterCard: "summary_large_image",
});
