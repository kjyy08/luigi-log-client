import { Button } from "@/shared/ui/button";
import { MarkdownEditor } from "@/shared/ui/markdown-editor";
import TextareaAutosize from "react-textarea-autosize";
import { ImagePlus, Loader2, RotateCcw, Trash2 } from "lucide-react";
import { useRef } from "react";
import { useEditorStore } from "../model/editor.store";
import { useImageUploadEditor } from "../model/use-image-upload-editor";

export const IssueEditor = () => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { title, setTitle, body, setBody } = useEditorStore();
    const {
        imageUploads,
        insertAndUploadImages,
        handlePaste,
        handleDrop,
        handleDragOver,
        retryImageUpload,
        removeImageUploadPlaceholderById,
    } = useImageUploadEditor({ textareaRef });

    const failedUploads = imageUploads.filter((upload) => upload.status === "failed");
    const activeUploads = imageUploads.filter((upload) => upload.status === "pending" || upload.status === "uploading");

    const handleFilePickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        insertAndUploadImages(files);
        event.target.value = "";
    };

    const uploadFooter = (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 text-xs"
                >
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Add images
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="hidden"
                    onChange={handleFilePickerChange}
                />
                {activeUploads.length > 0 && (
                    <span className="inline-flex items-center text-xs text-muted-foreground">
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        {activeUploads.length} image{activeUploads.length > 1 ? "s" : ""} uploading
                    </span>
                )}
            </div>

            {failedUploads.length > 0 && (
                <div className="space-y-2 rounded-md border border-destructive/30 bg-destructive/5 p-2 text-xs">
                    <p className="font-medium text-destructive">
                        Some images failed to upload. Retry or remove them before publishing.
                    </p>
                    {failedUploads.map((upload) => (
                        <div key={upload.id} className="flex items-center justify-between gap-2">
                            <span className="truncate text-muted-foreground">{upload.fileName}</span>
                            <div className="flex shrink-0 items-center gap-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => retryImageUpload(upload.id)}
                                >
                                    <RotateCcw className="mr-1 h-3 w-3" />
                                    Retry
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                                    onClick={() => removeImageUploadPlaceholderById(upload.id)}
                                >
                                    <Trash2 className="mr-1 h-3 w-3" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col space-y-4 w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
            {/* Title Input */}
            <div className="bg-background rounded-lg border shadow-sm p-4">
                <TextareaAutosize
                    placeholder="Title"
                    className="w-full resize-none text-2xl font-bold placeholder:text-muted-foreground outline-none bg-transparent"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxRows={2}
                />
            </div>

            {/* Body Editor with Tabs */}
            <MarkdownEditor
                value={body}
                onChange={setBody}
                placeholder="Add your description here..."
                className="min-h-[500px]"
                editorClassName="min-h-[400px]"
                minRows={15}
                textareaRef={textareaRef}
                onPaste={handlePaste}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                footer={uploadFooter}
            />
        </div>
    );
};
