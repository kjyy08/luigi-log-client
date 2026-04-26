import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import TextareaAutosize from "react-textarea-autosize";
import { MarkdownView } from "@/shared/ui/markdown-view";

import { cn } from "@/shared/lib/utils";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minRows?: number;
    disabled?: boolean;
    footer?: React.ReactNode;
    className?: string; // Container className
    editorClassName?: string; // Textarea className
    resizable?: boolean;
    textareaRef?: React.Ref<HTMLTextAreaElement>;
    onPaste?: React.ClipboardEventHandler<HTMLTextAreaElement>;
    onDrop?: React.DragEventHandler<HTMLTextAreaElement>;
    onDragOver?: React.DragEventHandler<HTMLTextAreaElement>;
}

export const MarkdownEditor = ({
    value,
    onChange,
    placeholder = "Add your comment here...",
    minRows = 3,
    disabled = false,
    footer,
    className,
    editorClassName,
    resizable = false,
    textareaRef,
    onPaste,
    onDrop,
    onDragOver
}: MarkdownEditorProps) => {
    return (
        <div className={cn("bg-background rounded-lg border shadow-sm overflow-hidden flex flex-col", className)}>
            <Tabs defaultValue="write" className="flex flex-col flex-1">
                <div className="border-b px-4 bg-muted/30">
                    <TabsList className="bg-transparent p-0 h-auto gap-2">
                        <TabsTrigger
                            value="write"
                            className="rounded-t-md rounded-b-none border-x border-t border-transparent data-[state=active]:border-border data-[state=active]:bg-background px-4 py-3 h-auto text-sm"
                        >
                            Write
                        </TabsTrigger>
                        <TabsTrigger
                            value="preview"
                            className="rounded-t-md rounded-b-none border-x border-t border-transparent data-[state=active]:border-border data-[state=active]:bg-background px-4 py-3 h-auto text-sm"
                        >
                            Preview
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="write" className="flex-1 p-4 mt-0">
                    <TextareaAutosize
                        ref={textareaRef}
                        placeholder={placeholder}
                        className={cn(
                            "w-full h-full text-base leading-relaxed placeholder:text-muted-foreground/50 outline-none bg-transparent min-h-[100px]",
                            !resizable && "resize-none",
                            editorClassName
                        )}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        minRows={minRows}
                        disabled={disabled}
                        onPaste={onPaste}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                    />

                </TabsContent>

                <TabsContent value="preview" className={cn(
                    "flex-1 p-4 mt-0 bg-white/50 dark:bg-black/20 min-h-[100px]",
                    editorClassName
                )}>
                    {value ? (
                        <div className="prose dark:prose-invert max-w-none text-sm">
                            <MarkdownView content={value} />
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground text-sm py-8">
                            No content to preview.
                        </div>
                    )}
                </TabsContent>
            </Tabs>
            {footer && (
                <div className="bg-muted/10 border-t p-2">
                    {footer}
                </div>
            )}
        </div>
    );
};
