import { useEffect, useId, useState } from "react";
import { useTheme } from "@/shared/providers/theme-provider";
import { cn } from "@/shared/lib/utils";

interface MermaidDiagramProps {
    source: string;
    className?: string;
}

type RenderState =
    | { status: "loading"; svg: string | null }
    | { status: "success"; svg: string }
    | { status: "error"; svg: string | null };

export const MermaidDiagram = ({ source, className }: MermaidDiagramProps) => {
    const { resolvedTheme } = useTheme();
    const reactId = useId();
    const [renderState, setRenderState] = useState<RenderState>({ status: "loading", svg: null });

    useEffect(() => {
        let isCancelled = false;
        const renderId = `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

        const renderDiagram = async () => {
            setRenderState((current) => ({ status: "loading", svg: current.svg }));

            try {
                const mermaid = (await import("mermaid")).default;

                mermaid.initialize({
                    startOnLoad: false,
                    securityLevel: "strict",
                    theme: resolvedTheme === "dark" ? "dark" : "default",
                });

                const { svg } = await mermaid.render(renderId, source);

                if (!isCancelled) {
                    setRenderState({ status: "success", svg });
                }
            } catch (_error) {
                if (!isCancelled) {
                    setRenderState((current) => ({ status: "error", svg: current.svg }));
                }
            }
        };

        void renderDiagram();

        return () => {
            isCancelled = true;
        };
    }, [reactId, resolvedTheme, source]);

    if (renderState.status === "error") {
        return (
            <figure className={cn("my-5 overflow-hidden rounded-xl border border-destructive/30 bg-destructive/5", className)}>
                <figcaption className="border-b border-destructive/20 px-4 py-3 text-sm font-medium text-destructive">Diagram could not be rendered.</figcaption>
                <pre className="m-0 overflow-x-auto bg-transparent p-4 text-sm">
                    <code>{source}</code>
                </pre>
            </figure>
        );
    }

    return (
        <figure className={cn("my-5 overflow-x-auto rounded-xl border border-border/80 bg-background p-4 shadow-sm dark:border-white/10", className)}>
            {renderState.svg ? (
                <div className="flex min-w-full justify-center [&_svg]:h-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: renderState.svg }} />
            ) : (
                <div className="text-sm text-muted-foreground" role="status">
                    Rendering diagram...
                </div>
            )}
        </figure>
    );
};
