import { Button } from "@/shared/ui/button";
import { ArrowLeft, Save, Upload, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import { PublishModal } from "./publish-modal";
import { useEditorStore } from "../model/editor.store";
import { getImageUploadPublishBlockMessage } from "../model/image-upload-utils";
import { useEditorActions } from "../model/use-editor-actions";

export const EditorToolbar = () => {
    const { toast } = useToast();
    const { title, body, postId, imageUploads } = useEditorStore();
    const { publishPost, deleteCurrentPost, tempSave, goBack, isPublishing, isDeleting } = useEditorActions();

    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

    const handlePublishClick = () => {
        if (!title || !body) {
            toast({
                title: "Missing input",
                description: "Please enter both title and content.",
                variant: "destructive",
            });
            return;
        }
        const imageUploadBlockMessage = getImageUploadPublishBlockMessage(imageUploads, body);
        if (imageUploadBlockMessage) {
            toast({
                title: "Images not ready",
                description: imageUploadBlockMessage,
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
                Back
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
                        Delete
                    </Button>
                )}
                <Button variant="outline" onClick={tempSave} className="border-luigi-green/50 text-luigi-green hover:bg-luigi-green/10">
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                </Button>
                <Button variant="default" onClick={handlePublishClick} className="bg-luigi-green hover:bg-luigi-green/90 text-white font-bold">
                    <Upload className="mr-2 h-4 w-4" />
                    Publish
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

