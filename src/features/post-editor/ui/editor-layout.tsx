import { EditorToolbar } from "./editor-toolbar";
import { MarkdownEditor } from "./markdown-editor";
import { MarkdownPreview } from "./markdown-preview";

export const EditorLayout = () => {
    return (
        <div className="flex flex-col h-screen overflow-hidden animate-fade-in">
            <EditorToolbar />
            <div className="flex flex-1 overflow-hidden">
                <MarkdownEditor />
                <MarkdownPreview />
            </div>
        </div>
    );
};
