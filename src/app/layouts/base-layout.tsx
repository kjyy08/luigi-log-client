import { AnimatedOutlet } from "@/shared/ui/animated-outlet";
import { Header } from "@/features/navigation/ui/header";
import { LoginButton } from "@/features/auth/ui/login-button";
import { GlobalFooter } from "@/features/navigation/ui/global-footer";

export const BaseLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
            <Header rightActions={<LoginButton />} />
            <main className="flex-1 container py-6">
                <AnimatedOutlet />
            </main>
            <GlobalFooter />
        </div>
    );
};
