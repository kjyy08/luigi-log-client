import { useState } from "react";
import { KeyRound, Settings, ShieldAlert, Trash2, User } from "lucide-react";
import { AdminApiKeysPanel } from "@/pages/admin-api-keys";
import { useAuthStore } from "@/entities/auth";
import { useAuthActions } from "@/features/auth/model/use-auth-actions";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ContentReveal } from "@/shared/ui/content-reveal";

const AccountSettingsPanel = () => {
    const { member } = useAuthStore();
    const { deleteAccount } = useAuthActions();
    const [confirmUsername, setConfirmUsername] = useState("");

    const username = member?.username ?? "";
    const canDelete = !!username && confirmUsername === username;

    return (
        <section className="space-y-6" aria-labelledby="account-settings-heading">
            <div className="space-y-2">
                <h2 id="account-settings-heading" className="text-2xl font-semibold tracking-tight">
                    Account
                </h2>
                <p className="text-muted-foreground">Manage your signed-in account information and account deletion.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Profile</CardTitle>
                    </div>
                    <CardDescription>Your signed-in account information.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                        <p className="font-medium text-foreground">Username</p>
                        <p className="text-muted-foreground">{member?.username}</p>
                    </div>
                    <div>
                        <p className="font-medium text-foreground">Email</p>
                        <p className="text-muted-foreground">{member?.email ?? "Not provided"}</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-destructive/30">
                <CardHeader>
                    <div className="flex items-center gap-2 text-destructive">
                        <Trash2 className="h-5 w-5" />
                        <CardTitle>Danger Zone</CardTitle>
                    </div>
                    <CardDescription>Account deletion is permanent. Type your username to enable this action.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="delete-account-confirmation">
                            Type <span className="font-mono text-foreground">{username}</span> to confirm
                        </Label>
                        <Input
                            id="delete-account-confirmation"
                            value={confirmUsername}
                            onChange={(event) => setConfirmUsername(event.target.value)}
                            placeholder={username}
                            autoComplete="off"
                        />
                    </div>
                    <Button type="button" variant="destructive" onClick={deleteAccount} disabled={!canDelete}>
                        <Trash2 className="h-4 w-4" />
                        Delete account
                    </Button>
                </CardContent>
            </Card>
        </section>
    );
};

const settingsNavItemClassName = (isActive: boolean) =>
    cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-[color,background-color,box-shadow,transform] duration-150 ease-out",
        "hover:bg-accent hover:text-accent-foreground active:scale-[0.985] motion-reduce:transition-none motion-reduce:active:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luigi-gold/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isActive ? "bg-accent text-accent-foreground shadow-[inset_2px_0_0_#FBD000]" : "text-muted-foreground",
    );

export const SettingsPage = () => {
    const { isAuthenticated, credentials } = useAuthStore();
    const [activeSection, setActiveSection] = useState<"account" | "api-keys">("account");
    const isAdmin = credentials?.role === "ADMIN";
    const isApiKeysActive = isAdmin && activeSection === "api-keys";

    if (!isAuthenticated) {
        return (
            <ContentReveal className="container mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center gap-4 px-4 py-12 text-center">
                <ShieldAlert className="h-12 w-12 text-muted-foreground" />
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Sign in required</h1>
                    <p className="text-muted-foreground">Sign in to manage your account settings.</p>
                </div>
            </ContentReveal>
        );
    }

    return (
        <ContentReveal className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
            <div className="mb-8 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-luigi-green">
                    <Settings className="h-4 w-4" />
                    Account
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="max-w-2xl text-muted-foreground">Manage your account settings from one place.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-[220px_minmax(0,1fr)]">
                <aside aria-label="Settings navigation" className="md:border-r md:pr-6">
                    <nav className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
                        <button
                            type="button"
                            className={settingsNavItemClassName(!isApiKeysActive)}
                            aria-current={!isApiKeysActive ? "page" : undefined}
                            onClick={() => setActiveSection("account")}
                        >
                            <User className="h-4 w-4 shrink-0" />
                            Account
                        </button>
                        {isAdmin ? (
                            <button
                                type="button"
                                className={settingsNavItemClassName(isApiKeysActive)}
                                aria-current={isApiKeysActive ? "page" : undefined}
                                onClick={() => setActiveSection("api-keys")}
                            >
                                <KeyRound className="h-4 w-4 shrink-0" />
                                API keys
                            </button>
                        ) : null}
                    </nav>
                </aside>

                <div className="min-w-0">{isApiKeysActive ? <AdminApiKeysPanel /> : <AccountSettingsPanel />}</div>
            </div>
        </ContentReveal>
    );
};
