import { buildDefaultMetadata } from "../../shared/seo/metadata.ts";

export const getRouteMetadata = (pathname: string) => {
    if (pathname === "/blog") return buildDefaultMetadata({ path: pathname, title: "Blog | Luigi Log" });
    if (pathname === "/portfolio") return buildDefaultMetadata({ path: pathname, title: "Portfolio | Luigi Log" });
    if (pathname === "/guestbook") return buildDefaultMetadata({ path: pathname, title: "Guestbook | Luigi Log" });
    if (pathname.startsWith("/settings")) return buildDefaultMetadata({ path: pathname, title: "Settings | Luigi Log" });
    if (pathname.startsWith("/write") || pathname.startsWith("/new")) return buildDefaultMetadata({ path: pathname, title: "Write | Luigi Log" });
    return buildDefaultMetadata({ path: pathname });
};
