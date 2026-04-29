import { createElement, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import kotlin from "react-syntax-highlighter/dist/esm/languages/prism/kotlin";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, X } from "lucide-react";
import { useTheme } from "@/shared/providers/theme-provider";
import { cn } from "@/shared/lib/utils";

SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("kotlin", kotlin);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("md", markdown);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("ts", typescript);
SyntaxHighlighter.registerLanguage("yaml", yaml);
SyntaxHighlighter.registerLanguage("yml", yaml);

type CopyState = "idle" | "success" | "error";

const CodeBlock = ({ language, value }: { language?: string; value: string }) => {
    const [copyState, setCopyState] = useState<CopyState>("idle");
    const { resolvedTheme } = useTheme();
    const languageLabel = language ? language.replace(/-/g, " ") : "Plain text";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopyState("success");
        } catch (_error) {
            setCopyState("error");
        } finally {
            window.setTimeout(() => setCopyState("idle"), 2000);
        }
    };

    const isCopied = copyState === "success";
    const copyLabel = isCopied ? "Copied" : copyState === "error" ? "Copy failed" : "Copy";

    return (
        <figure className="group my-5 overflow-hidden rounded-xl border border-border/80 bg-muted/30 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <figcaption className="flex min-h-10 items-center justify-between gap-3 border-b border-border/70 bg-muted/40 px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]">
                <span className="rounded-full border border-border/70 bg-background/80 px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground dark:border-white/10 dark:bg-black/20">
                    {languageLabel}
                </span>
                <button
                    type="button"
                    onClick={handleCopy}
                    className={cn(
                        "inline-flex min-h-8 items-center gap-1.5 rounded-md border border-border/70 bg-background/80 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-white/10 dark:bg-white/[0.04]",
                        isCopied && "text-emerald-500 dark:text-emerald-400",
                        copyState === "error" && "text-destructive",
                    )}
                    aria-live="polite"
                    aria-label={`${copyLabel} code block`}
                    title={`${copyLabel} code block`}
                >
                    {isCopied ? <Check className="h-3.5 w-3.5" /> : copyState === "error" ? <X className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copyLabel}</span>
                </button>
            </figcaption>
            <SyntaxHighlighter
                style={resolvedTheme === "dark" ? oneDark : oneLight}
                language={language || "text"}
                PreTag="div"
                customStyle={{
                    margin: 0,
                    padding: "1.25rem",
                    background: resolvedTheme === "dark" ? "transparent" : "#f8fafc",
                    fontSize: "0.92rem",
                    overflowX: "auto",
                }}
                codeTagProps={{
                    style: {
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    },
                }}
            >
                {value}
            </SyntaxHighlighter>
        </figure>
    );
};

interface MarkdownViewProps {
    content: string;
    className?: string;
    headingIds?: string[];
}

export const MarkdownView = ({ content, className, headingIds = [] }: MarkdownViewProps) => {
    let headingIndex = 0;
    const headingComponents = ([1, 2, 3, 4] as const).reduce(
        (components, level) => ({
            ...components,
            [`h${level}`]: ({ children, ...props }: any) => {
                const id = headingIds[headingIndex++];

                return createElement(
                    `h${level}`,
                    {
                        ...props,
                        id,
                        className: cn(id && "scroll-mt-24"),
                    },
                    id ? (
                        <a href={`#${id}`} className="no-underline hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                            {children}
                        </a>
                    ) : children,
                );
            },
        }),
        {},
    );

    return (
        <div className={cn("prose max-w-none break-words dark:prose-invert prose-img:max-w-full prose-img:rounded-md prose-pre:bg-transparent prose-pre:p-0 prose-figure:my-0", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    ...headingComponents,
                    code({ inline, className, children, ...props }: any) {
                        const match = /language-([\w-]+)/.exec(className || "");
                        const value = String(children).replace(/\n$/, "");

                        if (!inline && (match || String(children).includes("\n") || className)) {
                            return <CodeBlock language={match ? match[1] : undefined} value={value} />;
                        }

                        return (
                            <code className={cn("px-1.5 py-0.5 rounded-md bg-muted font-medium text-[0.9em]", className)} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
