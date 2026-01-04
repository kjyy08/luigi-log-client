import { Button } from "@/shared/ui/button";
import { ArrowLeft, Save, Upload, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import { PublishModal } from "./publish-modal";
import { useEditorStore } from "../model/editor.store";
import { useEditorActions } from "../model/use-editor-actions";

export const EditorToolbar = () => {
    const { toast } = useToast();
    const { title, body, postId } = useEditorStore();
    const { publishPost, deleteCurrentPost, tempSave, goBack, isPublishing, isDeleting } = useEditorActions();

    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

    const handlePublishClick = () => {
        if (!title || !body) {
            toast({
                title: "입력 부족",
                description: "제목과 내용을 모두 입력해주세요.",
                variant: "destructive",
            });
            return;
        }
        setIsPublishModalOpen(true);
    };

    return (
        <div className="h-16 border-b flex items-center justify-between px-4 bg-background z-50">
            <Button variant="ghost" onClick={goBack} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                뒤로가기
            </Button>

            <div className="flex items-center gap-2">
                {postId && (
                    <Button
                        variant="ghost"
                        onClick={deleteCurrentPost}
                        disabled={isDeleting}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive mr-2"
                    >
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                        삭제
                    </Button>
                )}
                <Button variant="outline" onClick={tempSave} className="border-luigi-green/50 text-luigi-green hover:bg-luigi-green/10">
                    <Save className="mr-2 h-4 w-4" />
                    임시저장
                </Button>
                <Button variant="default" onClick={handlePublishClick} className="bg-luigi-green hover:bg-luigi-green/90 text-white font-bold">
                    <Upload className="mr-2 h-4 w-4" />
                    출간하기
                </Button>
            </div>

            <PublishModal
                open={isPublishModalOpen}
                onOpenChange={setIsPublishModalOpen}
                onPublish={publishPost}
                isLoading={isPublishing}
            />
        </div>
    );
};

