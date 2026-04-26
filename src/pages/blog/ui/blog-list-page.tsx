import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import { PageHeader } from "@/shared/ui/page-header";
import { PostList } from "@/features/post-list";
import { useIsOwner } from "@/shared/hooks/use-is-owner";
import { Button } from "@/shared/ui/button";
import { PostListSkeleton } from "@/features/post-list/ui/post-list-skeleton";
import { FilterBar } from "./components/filter-bar";

export const BlogListPage = () => {
	const isOwner = useIsOwner();
	const [searchParams, setSearchParams] = useSearchParams();
	const searchQuery = searchParams.get("q")?.trim() ?? "";

	const handleSearchChange = (query: string) => {
		const trimmedQuery = query.trim();
		setSearchParams((current) => {
			const next = new URLSearchParams(current);

			if (trimmedQuery) {
				next.set("q", trimmedQuery);
			} else {
				next.delete("q");
			}

			return next;
		});
	};

	return (
		<div className="mx-auto w-full max-w-7xl px-0 py-4 sm:px-2 md:py-8">
			<div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
				<PageHeader
					title="Posts"
					description="Recent articles and updates."
					className="mb-0 border-none pb-0"
				/>
				{isOwner && (
					<Button asChild className="h-9 rounded-md bg-luigi-green px-4 font-bold text-white shadow-sm hover:bg-luigi-green/90">
						<Link to="/write">
							<Pencil className="mr-2 h-4 w-4" />
							New post
						</Link>
					</Button>
				)}
			</div>

			<FilterBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />

			<React.Suspense fallback={<PostListSkeleton viewMode="list" count={5} />}>
				<PostList fixedType="BLOG" showTabs={false} viewMode="list" searchQuery={searchQuery} />
			</React.Suspense>
		</div>
	);
};
