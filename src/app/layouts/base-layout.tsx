import { Outlet } from "react-router-dom";
import { Header } from "@/features/navigation/ui/header";
import { LoginButton } from "@/features/auth/ui/login-button";

export const BaseLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
            <Header rightActions={<LoginButton />} />
            <main className="flex-1 container py-6">
                <Outlet />
            </main>
            <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        © 2026 Luigi Log. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};
