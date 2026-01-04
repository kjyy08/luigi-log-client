import TextareaAutosize from "react-textarea-autosize";
import { useEditorStore } from "../model/editor.store";

export const MarkdownEditor = () => {
    const { title, body, setTitle, setBody } = useEditorStore();

    return (
        <div className="flex flex-col h-full p-8 md:p-12 overflow-y-auto w-full md:w-1/2">
            <TextareaAutosize
                placeholder="제목을 입력하세요"
                className="w-full resize-none text-4xl font-bold placeholder:text-muted-foreground outline-none bg-transparent mb-8"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxRows={2} // Prevent title from taking up too much space
            />

            <div className="w-16 h-1 bg-luigi-green mb-8 rounded-full" />

            <TextareaAutosize
                placeholder="당신의 이야기를 시작하세요..."
                className="w-full resize-none text-lg leading-relaxed placeholder:text-muted-foreground/50 outline-none bg-transparent flex-1 min-h-[500px]"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                minRows={20}
            />
        </div>
    );
};
