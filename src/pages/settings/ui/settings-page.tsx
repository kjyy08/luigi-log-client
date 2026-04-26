import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Settings, ShieldAlert, Trash2, User } from "lucide-react";
import { useAuthStore } from "@/entities/auth";
import { useAuthActions } from "@/features/auth/model/use-auth-actions";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

export const SettingsPage = () => {
    const { isAuthenticated, member } = useAuthStore();
    const { deleteAccount } = useAuthActions();
    const [confirmUsername, setConfirmUsername] = useState("");

    const username = member?.username ?? "";
    const canDelete = !!username && confirmUsername === username;

    if (!isAuthenticated) {
        return (
            <main className="container mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center gap-4 px-4 py-12 text-center">
                <ShieldAlert className="h-12 w-12 text-muted-foreground" />
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Sign in required</h1>
                    <p className="text-muted-foreground">Sign in to manage your account settings.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto max-w-5xl px-4 py-8 sm:py-12">
            <div className="mb-8 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-luigi-green">
                    <Settings className="h-4 w-4" />
                    Account
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="max-w-2xl text-muted-foreground">
                    Manage your account and admin API key access from one place.
                </p>
            </div>

            <Tabs defaultValue="account">
                <TabsList className="mb-6">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="api-keys">API keys</TabsTrigger>
                </TabsList>

                <TabsContent value="account" className="space-y-6">
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
                            <CardDescription>
                                Account deletion is permanent. Type your username to enable this action.
                            </CardDescription>
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
                </TabsContent>

                <TabsContent value="api-keys">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <KeyRound className="h-5 w-5 text-muted-foreground" />
                                <CardTitle>API keys</CardTitle>
                            </div>
                            <CardDescription>
                                Admin API keys are managed on the dedicated admin page. Admin access is required there.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="bg-luigi-green text-white hover:bg-luigi-green/90">
                                <Link to="/admin/api-keys">Open API key management</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    );
};
