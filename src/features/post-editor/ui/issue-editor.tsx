import { useEditorStore } from "../model/editor.store";
import TextareaAutosize from "react-textarea-autosize";
import { MarkdownEditor } from "@/shared/ui/markdown-editor";


export const IssueEditor = () => {
    const { title, setTitle, body, setBody } = useEditorStore();

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
            />
        </div>
    );
};
