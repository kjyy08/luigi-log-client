import type { ReactNode } from "react";
import { useState } from "react";
import type { PostType } from "@/entities/post/model/post.dto";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Textarea } from "@/shared/ui/textarea";
import { X } from "lucide-react";
import { useEditorStore } from "../model/editor.store";

interface PostEditorSidebarProps {
	actions?: ReactNode;
}

export const PostEditorSidebar = ({ actions }: PostEditorSidebarProps) => {
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
		<aside className="w-full lg:w-80 lg:border-l bg-muted/10 p-4 space-y-6 lg:overflow-y-auto lg:max-h-[calc(100vh-8rem)] lg:sticky lg:top-6">
			{actions && (
				<div className="rounded-lg border bg-background/95 p-3 shadow-sm lg:sticky lg:top-0 lg:z-10">
					{actions}
				</div>
			)}

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
						{tags.map((tag) => (
							<span key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1">
								{tag}
								<button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive" aria-label={`Remove ${tag} tag`}>
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
			</div>
		</aside>
	);
};
