

export const GlobalFooter = () => {
    return (
        <footer className="w-full border-t bg-background py-8 text-sm text-muted-foreground">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-center">
                <p className="text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Luigi Log. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
