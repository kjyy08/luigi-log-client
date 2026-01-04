import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BaseLayout } from "@/app/layouts/base-layout";
import { HomePage } from "@/pages/home";
import { PostListPage } from "@/pages/post";
import { BlogListPage } from "@/pages/blog";
import { PortfolioListPage } from "@/pages/portfolio";
import { WritePostPage } from "@/pages/admin/write-post-page";
import { EditPostPage } from "@/pages/admin/edit-post-page";
import { OAuthCallbackPage } from "@/pages/auth";
import { SettingsPage } from "@/pages/settings/ui/settings-page";
import { AboutPage } from "@/pages/about/ui/about-page";
import { PostDetailPage } from "@/pages/post-detail/ui/post-detail-page";
import { Toaster } from "@/shared/ui/toaster";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<BaseLayout />}>
                    <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
                    <Route path="/oauth/callback/login" element={<OAuthCallbackPage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/posts" element={<PostListPage />} />
                    <Route path="/blog" element={<BlogListPage />} />
                    <Route path="/portfolio" element={<PortfolioListPage />} />
                    <Route path="/posts/:slug" element={<PostDetailPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/write" element={<WritePostPage />} />
                    <Route path="/posts/:id/edit" element={<EditPostPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<div className="flex h-[50vh] items-center justify-center text-xl text-muted-foreground">404 Not Found</div>} />
                </Route>
            </Routes>
            <Toaster />
        </BrowserRouter>
    );
};
