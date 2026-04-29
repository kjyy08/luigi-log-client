import { useState } from "react";
import type { PostType } from "@/entities/post/model/post.dto";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Textarea } from "@/shared/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEditorStore } from "../model/editor.store";

interface PublishModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onPublish: () => void;
	isLoading?: boolean;
}

export const PublishModal = ({ open, onOpenChange, onPublish, isLoading }: PublishModalProps) => {
	const {
		slug,
		setSlug,
		description,
		setDescription,
		tags,
		setTags,
		type,
		setType,
		title,
	} = useEditorStore();
	const [tagInput, setTagInput] = useState("");

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
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[520px]">
				<DialogHeader>
					<DialogTitle>Publish preview</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-4">
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
						<Label htmlFor="desc">Description</Label>
						<Textarea
							id="desc"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Write a short introduction."
							className="h-24 resize-none"
						/>
					</div>

					<div className="space-y-2">
						<Label>Tags</Label>
						<div className="flex flex-wrap gap-2 mb-2">
							{tags.map((tag) => (
								<span key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1">
									{tag}
									<button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive" aria-label={`Remove ${tag} tag`}>
										×
									</button>
								</span>
							))}
						</div>
						<Input
							value={tagInput}
							onChange={(e) => setTagInput(e.target.value)}
							onKeyDown={handleTagKeyDown}
							placeholder="Press Enter to add tags"
						/>
					</div>

					<div className="space-y-2">
						<Label>Post Type</Label>
						<RadioGroup value={type} onValueChange={(value) => setType(value as PostType)}>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="BLOG" id="publish-blog" />
								<Label htmlFor="publish-blog" className="font-normal cursor-pointer">
									Blog Post
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="PORTFOLIO" id="publish-portfolio" />
								<Label htmlFor="publish-portfolio" className="font-normal cursor-pointer">
									Portfolio
								</Label>
							</div>
						</RadioGroup>
					</div>
				</div>

				<DialogFooter>
					<Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
					<Button
						onClick={onPublish}
						disabled={isLoading}
						className="bg-luigi-green text-white hover:bg-luigi-green/90 min-w-[100px]"
					>
						{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
						Publish
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
