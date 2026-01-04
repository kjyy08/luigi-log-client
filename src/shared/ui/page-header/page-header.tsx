import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: ReactNode;
    className?: string;
}

export const PageHeader = ({ title, description, children, className }: PageHeaderProps) => {
    return (
        <div className={cn("flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6 mb-10", className)}>
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                {description && (
                    <p className="text-muted-foreground mt-2">
                        {description}
                    </p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-4">
                    {children}
                </div>
            )}
        </div>
    );
};
