import { useEditorStore } from "../model/editor.store";
import { MarkdownView } from "@/shared/ui/markdown-view";

export const MarkdownPreview = () => {
    const { title, body } = useEditorStore();

    return (
        <div className="hidden md:flex flex-col h-full bg-muted/30 p-12 overflow-y-scroll w-1/2 border-l custom-scrollbar">
            <h1 className="text-4xl font-bold mb-8 break-words text-foreground">
                {title || "제목 없음"}
            </h1>

            <MarkdownView content={body || "내용을 입력하면 미리보기가 표시됩니다."} />
        </div>
    );
};
