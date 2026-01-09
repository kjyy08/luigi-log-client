import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BaseLayout } from "@/app/layouts/base-layout";
import { HomePage } from "@/pages/home";
import { BlogListPage } from "@/pages/blog";
import { PortfolioListPage } from "@/pages/portfolio";
import { PostWritePage } from "@/pages/post-write";
import { OAuthCallbackPage, LoginPage } from "@/pages/auth";
import { AboutPage } from "@/pages/about/ui/about-page";
import { PostDetailPage } from "@/pages/post-detail/ui/post-detail-page";
import { GuestbookPage } from "@/pages/guestbook";
import { Toaster } from "@/shared/ui/toaster";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<BaseLayout />}>
                    <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
                    <Route path="/oauth/callback/login" element={<OAuthCallbackPage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/blog" element={<BlogListPage />} />
                    <Route path="/portfolio" element={<PortfolioListPage />} />
                    <Route path="/guestbook" element={<GuestbookPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/posts/:username/:slug" element={<PostDetailPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/write" element={<PostWritePage />} />
                    <Route path="/new" element={<PostWritePage />} />
                    <Route path="/posts/:id/edit" element={<PostWritePage />} />
                    <Route path="*" element={<div className="flex h-[50vh] items-center justify-center text-xl text-muted-foreground">404 Not Found</div>} />
                </Route>
            </Routes>
            <Toaster />
        </BrowserRouter>
    );
};
