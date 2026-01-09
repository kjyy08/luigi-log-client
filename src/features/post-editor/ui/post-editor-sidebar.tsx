import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { useEditorStore } from "../model/editor.store";
import { useState } from "react";
import { useUploadFile } from "@/entities/file/model/file.mutations";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import type { PostType } from "@/entities/post/model/post.dto";
import { X, Upload } from "lucide-react";

export const PostEditorSidebar = () => {
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
            const response = await uploadFile(file);
            setThumbnail(response.publicUrl);
        } catch (error) {
            console.error("Thumbnail upload failed", error);
            alert("이미지 업로드에 실패했습니다.");
        }
    };

    return (
        <aside className="w-80 border-l bg-muted/10 p-4 space-y-6 overflow-y-auto h-full hidden lg:block">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-muted-foreground">Post Type</Label>
                    <RadioGroup value={type} onValueChange={(value) => setType(value as PostType)}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="BLOG" id="blog" />
                            <Label htmlFor="blog" className="font-normal cursor-pointer text-sm">
                                Blog Post
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="PORTFOLIO" id="portfolio" />
                            <Label htmlFor="portfolio" className="font-normal cursor-pointer text-sm">
                                Portfolio
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-muted-foreground">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                            <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1">
                                {tag}
                                <button onClick={() => removeTag(tag)} className="hover:text-destructive">
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Add tags..."
                        className="h-8 text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-muted-foreground" htmlFor="slug">Slug</Label>
                    <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder={title.toLowerCase().replace(/ /g, "-")}
                        className="h-8 text-sm font-mono text-muted-foreground"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-muted-foreground" htmlFor="desc">Description</Label>
                    <Textarea
                        id="desc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Short description..."
                        className="h-24 resize-none text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold text-muted-foreground">Thumbnail</Label>
                    <div className="aspect-video w-full rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50 relative overflow-hidden group hover:border-luigi-green/50 transition-colors">
                        {thumbnail ? (
                            <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-muted-foreground flex flex-col items-center gap-1">
                                <Upload className="h-8 w-8 opacity-50" />
                                <span className="text-xs">Upload Image</span>
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
                        <Button variant="ghost" size="sm" onClick={() => setThumbnail(null)} className="w-full h-8 text-xs text-destructive hover:text-destructive">
                            Remove Thumbnail
                        </Button>
                    )}
                </div>
            </div>
        </aside>
    );
};
