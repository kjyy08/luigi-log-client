import type { FormEvent } from "react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Search, X } from "lucide-react";

interface FilterBarProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
}

export const FilterBar = ({ searchQuery, onSearchChange }: FilterBarProps) => {
	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		onSearchChange(String(formData.get("q") ?? "").trim());
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-3 border-b border-border pb-4 mb-6 sm:flex-row sm:items-center"
		>
			<label className="relative min-w-0 flex-1">
				<span className="sr-only">Search posts</span>
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					key={searchQuery}
					name="q"
					defaultValue={searchQuery}
					placeholder="Search posts..."
					className="h-10 w-full bg-background pl-9 pr-10 border-border focus-visible:ring-luigi-green transition-all"
				/>
				{searchQuery && (
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground"
						onClick={() => onSearchChange("")}
						aria-label="Clear search"
					>
						<X className="h-4 w-4" />
					</Button>
				)}
			</label>
			<Button type="submit" className="h-10 shrink-0 bg-luigi-green text-white hover:bg-luigi-green/90">
				Search
			</Button>
		</form>
	);
};
