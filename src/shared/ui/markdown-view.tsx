import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { useTheme } from "@/shared/providers/theme-provider";
import { cn } from "@/shared/lib/utils";


const CodeBlock = ({ language, value }: { language?: string; value: string }) => {
    const [copied, setCopied] = useState(false);
    const { theme } = useTheme();

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-4 rounded-lg overflow-hidden border dark:border-white/10">
            <button
                onClick={handleCopy}
                className="absolute right-3 top-3 p-1.5 rounded bg-muted/50 hover:bg-muted transition-colors z-10 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
                title="Copy code"
            >
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <SyntaxHighlighter
                style={theme === "dark" ? oneDark : oneLight}
                language={language || "text"}
                PreTag="div"
                customStyle={{
                    margin: 0,
                    padding: "1.25rem",
                    background: theme === "dark" ? undefined : "#f1f5f9", // slate-100
                    fontSize: "0.95rem",
                }}
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
};

interface MarkdownViewProps {
    content: string;
    className?: string;
}

export const MarkdownView = ({ content, className }: MarkdownViewProps) => {
    return (
        <div className={cn("prose prose-lg dark:prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0 break-words", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        const value = String(children).replace(/\n$/, "");

                        // If it's a block (not inline) or has a language match
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
