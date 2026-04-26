import { Button } from "@/shared/ui/button";
import { Link } from "react-router-dom";
import { useIsOwner } from "@/shared/hooks/use-is-owner";
import { Pencil } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postQueries } from "@/entities/post";
import { ProjectCard } from "@/entities/project/ui/project-card";
import React from "react";
import { PageHeader } from "@/shared/ui/page-header";
import { ContentReveal } from "@/shared/ui/content-reveal";

const PortfolioProjectList = () => {
    const { data } = useSuspenseQuery(postQueries.list({
        type: "PORTFOLIO",
        status: "PUBLISHED"
    }));

    const projects = data?.posts ?? [];

    if (projects.length === 0) {
        return (
            <div className="col-span-full text-center py-20 border border-dashed rounded-md text-muted-foreground text-sm">
                No projects pinned yet.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
                <ProjectCard
                    key={project.postId}
                    project={project}
                />
            ))}
        </div>
    );
};

export const PortfolioListPage = () => {
    const isOwner = useIsOwner();

    return (
        <ContentReveal className="container max-w-5xl mx-auto py-10">
            <div>
                <PageHeader
                    title="Portfolio"
                    description="A collection of my projects and work."
                >
                    {isOwner && (
                        <Button asChild className="bg-luigi-green hover:bg-luigi-green/90 text-white font-bold h-9">
                            <Link to="/write?type=PORTFOLIO">
                                <Pencil className="mr-2 h-4 w-4" />
                                New project
                            </Link>
                        </Button>
                    )}
                </PageHeader>
            </div>

            <React.Suspense fallback={null}>
                <PortfolioProjectList />
            </React.Suspense>
        </ContentReveal>
    );
};
