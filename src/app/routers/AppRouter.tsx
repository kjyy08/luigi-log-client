import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { getRouteMetadata } from "@/app/config/seo-metadata";
import { BaseLayout } from "@/app/layouts/base-layout";
import { RouteScrollRestoration } from "@/app/routers/scroll-restoration";
import { RouteSeoMetadata } from "@/shared/seo";
import { Toaster } from "@/shared/ui/toaster";

const HomePage = lazy(() => import("@/pages/home").then((module) => ({ default: module.HomePage })));
const BlogListPage = lazy(() => import("@/pages/blog").then((module) => ({ default: module.BlogListPage })));
const PortfolioListPage = lazy(() => import("@/pages/portfolio").then((module) => ({ default: module.PortfolioListPage })));
const PostWritePage = lazy(() => import("@/pages/post-write").then((module) => ({ default: module.PostWritePage })));
const OAuthCallbackPage = lazy(() => import("@/pages/auth").then((module) => ({ default: module.OAuthCallbackPage })));
const SettingsPage = lazy(() => import("@/pages/settings").then((module) => ({ default: module.SettingsPage })));
const PostDetailPage = lazy(() => import("@/pages/post-detail/ui/post-detail-page").then((module) => ({ default: module.PostDetailPage })));
const GuestbookPage = lazy(() => import("@/pages/guestbook").then((module) => ({ default: module.GuestbookPage })));

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <RouteSeoMetadata getMetadata={getRouteMetadata} />
            <RouteScrollRestoration />
            <Suspense fallback={null}>
                <Routes>
                    <Route element={<BaseLayout />}>
                        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
                        <Route path="/oauth/callback/login" element={<OAuthCallbackPage />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/blog" element={<BlogListPage />} />
                        <Route path="/portfolio" element={<PortfolioListPage />} />
                        <Route path="/guestbook" element={<GuestbookPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/admin/api-keys" element={<Navigate to="/settings" replace />} />
                        <Route path="/posts/:username/:slug" element={<PostDetailPage />} />

                        <Route path="/write" element={<PostWritePage />} />
                        <Route path="/new" element={<PostWritePage />} />
                        <Route path="/posts/:id/edit" element={<PostWritePage />} />
                        <Route path="*" element={<div className="flex h-[50vh] items-center justify-center text-xl text-muted-foreground">404 Not Found</div>} />
                    </Route>
                </Routes>
            </Suspense>
            <Toaster />
        </BrowserRouter>
    );
};
