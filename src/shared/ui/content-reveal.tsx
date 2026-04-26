import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

type ContentRevealProps = HTMLAttributes<HTMLDivElement>;

export const ContentReveal = ({ className, ...props }: ContentRevealProps) => (
    <div className={cn("motion-safe:animate-content-reveal", className)} {...props} />
);
