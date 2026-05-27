import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { buildDefaultMetadata, type SeoMetadata as SeoMetadataModel } from "./metadata";

const upsertMeta = (selector: string, attributes: Record<string, string>) => {
    let element = document.head.querySelector<HTMLMetaElement>(selector);
    if (!element) {
        element = document.createElement("meta");
        document.head.appendChild(element);
    }

    for (const [name, value] of Object.entries(attributes)) {
        element.setAttribute(name, value);
    }
};

const upsertLink = (rel: string, href: string) => {
    let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
    }

    element.setAttribute("href", href);
};

export const applySeoMetadata = (metadata: SeoMetadataModel) => {
    document.title = metadata.title;
    upsertLink("canonical", metadata.url);

    upsertMeta('meta[name="description"]', { name: "description", content: metadata.description });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: metadata.siteName });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: metadata.type });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: metadata.title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: metadata.description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: metadata.url });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: metadata.image });

    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: metadata.twitterCard });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: metadata.title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: metadata.description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: metadata.image });

    const existingArticleMeta = document.head.querySelectorAll('meta[property^="article:"]');
    existingArticleMeta.forEach((element) => element.remove());

    if (metadata.type === "article") {
        if (metadata.publishedTime) {
            upsertMeta('meta[property="article:published_time"]', {
                property: "article:published_time",
                content: metadata.publishedTime,
            });
        }
        if (metadata.modifiedTime) {
            upsertMeta('meta[property="article:modified_time"]', {
                property: "article:modified_time",
                content: metadata.modifiedTime,
            });
        }
        metadata.tags?.forEach((tag) => {
            const tagMeta = document.createElement("meta");
            tagMeta.setAttribute("property", "article:tag");
            tagMeta.setAttribute("content", tag);
            document.head.appendChild(tagMeta);
        });
    }
};

const getRouteMetadata = (pathname: string) => {
    if (pathname === "/blog") return buildDefaultMetadata({ path: pathname, title: "Blog | Luigi Log" });
    if (pathname === "/portfolio") return buildDefaultMetadata({ path: pathname, title: "Portfolio | Luigi Log" });
    if (pathname === "/guestbook") return buildDefaultMetadata({ path: pathname, title: "Guestbook | Luigi Log" });
    if (pathname.startsWith("/settings")) return buildDefaultMetadata({ path: pathname, title: "Settings | Luigi Log" });
    if (pathname.startsWith("/write") || pathname.startsWith("/new")) return buildDefaultMetadata({ path: pathname, title: "Write | Luigi Log" });
    return buildDefaultMetadata({ path: pathname });
};

export const RouteSeoMetadata = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        applySeoMetadata(getRouteMetadata(pathname));
    }, [pathname]);

    return null;
};

export const SeoMetadataTags = ({ metadata }: { metadata: SeoMetadataModel }) => {
    useEffect(() => {
        applySeoMetadata(metadata);
    }, [metadata]);

    return null;
};
