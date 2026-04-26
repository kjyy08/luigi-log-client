import { Outlet } from "react-router-dom";
import { Header } from "@/features/navigation/ui/header";
import { LoginButton } from "@/features/auth/ui/login-button";
import { LoginModal } from "@/features/auth/ui/login-modal";
import { GlobalFooter } from "@/features/navigation/ui/global-footer";

export const BaseLayout = () => {
    return (
        <div className="min-h-screen max-w-full overflow-x-clip flex flex-col bg-background font-sans antialiased">
            <Header rightActions={<LoginButton />} />
            <main className="flex-1 container min-w-0 py-6 px-3 sm:px-4">
                <Outlet />
            </main>
            <GlobalFooter />
            <LoginModal />
        </div>
    );
};
