import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { useEditorStore } from "../model/editor.store";
import { useState } from "react";
import { useUploadFile } from "@/entities/file/model/file.mutations";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import type { PostType } from "@/entities/post/model/post.dto";

interface PublishModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPublish: () => void;
    isLoading?: boolean;
}

export const PublishModal = ({ open, onOpenChange, onPublish, isLoading }: PublishModalProps) => {
    const {
        slug, setSlug,
        description, setDescription,
        thumbnail, setThumbnail,
        tags, setTags,
        type, setType,
        title
    } = useEditorStore();
    const [tagInput, setTagInput] = useState("");
    const { mutateAsync: uploadFile } = useUploadFile();

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // uploadFile API expects File, not FormData (it wraps it internally)
            const response = await uploadFile(file);
            setThumbnail(response.publicUrl);
        } catch (error) {
            console.error("Thumbnail upload failed", error);
            alert("이미지 업로드에 실패했습니다.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>포스트 미리보기 설정</DialogTitle>
                </DialogHeader>

                <div className="grid gap-6 py-4 md:grid-cols-2">
                    {/* Left Col: Thumbnail */}
                    <div className="space-y-4">
                        <Label>썸네일 설정</Label>
                        <div className="aspect-video w-full rounded-md border flex items-center justify-center bg-muted relative overflow-hidden group">
                            {thumbnail ? (
                                <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-muted-foreground flex flex-col items-center gap-2">
                                    <span className="text-sm">썸네일 업로드</span>
                                </div>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageUpload}
                            />
                        </div>
                        {thumbnail && (
                            <Button variant="outline" size="sm" onClick={() => setThumbnail(null)} className="w-full">
                                제거
                            </Button>
                        )}
                    </div>

                    {/* Right Col: Metadata */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug</Label>
                            <Input
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder={title.toLowerCase().replace(/ /g, "-")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="desc">설명 (Description)</Label>
                            <Textarea
                                id="desc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="포스트를 짧게 소개해보세요."
                                className="h-24 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>태그</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {tags.map(tag => (
                                    <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="hover:text-destructive">×</button>
                                    </span>
                                ))}
                            </div>
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                placeholder="태그 입력 후 Enter"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>포스트 타입</Label>
                            <RadioGroup value={type} onValueChange={(value) => setType(value as PostType)}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="BLOG" id="blog" />
                                    <Label htmlFor="blog" className="font-normal cursor-pointer">
                                        블로그 글
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="PORTFOLIO" id="portfolio" />
                                    <Label htmlFor="portfolio" className="font-normal cursor-pointer">
                                        포트폴리오
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>취소</Button>
                    <Button
                        onClick={onPublish}
                        disabled={isLoading}
                        className="bg-luigi-green text-white hover:bg-luigi-green/90 min-w-[100px]"
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        출간하기
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
