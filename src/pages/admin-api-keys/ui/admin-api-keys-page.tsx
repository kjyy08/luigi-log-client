import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Copy, KeyRound, Loader2, Plus, RefreshCw, ShieldAlert, Trash2 } from "lucide-react";
import { API_KEY_SCOPES, apiKeyQueries, useCreateApiKey, useRevokeApiKey } from "@/entities/api-key";
import type { ApiKey, ApiKeyScope, CreateApiKeyResponse } from "@/entities/api-key";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { useToast } from "@/shared/hooks/use-toast";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

const SCOPE_LABELS: Record<ApiKeyScope, string> = {
	"post:create": "Create posts",
	"post:update": "Update posts",
	"post:publish": "Publish posts",
	"media:upload": "Upload media",
};

const formatDateTime = (value: string | null) => {
	if (!value) return "Never";

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;

	return new Intl.DateTimeFormat("en", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date);
};

const getErrorMessage = (error: unknown, fallback: string) => {
	if (error instanceof Error && error.message) return error.message;
	return fallback;
};

const statusClassName = (status: string) => {
	switch (status.toUpperCase()) {
		case "ACTIVE":
			return "border-luigi-green/30 bg-luigi-green/10 text-luigi-green";
		case "REVOKED":
			return "border-destructive/30 bg-destructive/10 text-destructive";
		case "EXPIRED":
			return "border-amber-500/30 bg-amber-500/10 text-amber-600";
		default:
			return "border-border bg-secondary text-secondary-foreground";
	}
};

const ApiKeyCard = ({ apiKey, onRevoke }: { apiKey: ApiKey; onRevoke: (apiKey: ApiKey) => void }) => {
	const isRevokable = apiKey.status.toUpperCase() === "ACTIVE";

	return (
		<Card className="overflow-hidden shadow-sm">
			<CardHeader className="gap-3 p-5 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
				<div className="min-w-0 space-y-2">
					<div className="flex flex-wrap items-center gap-2">
						<CardTitle className="truncate text-lg">{apiKey.name}</CardTitle>
						<Badge className={statusClassName(apiKey.status)}>{apiKey.status}</Badge>
					</div>
					<CardDescription className="font-mono text-xs">Prefix: {apiKey.prefix}</CardDescription>
				</div>
				<Button
					variant="destructive"
					size="sm"
					onClick={() => onRevoke(apiKey)}
					disabled={!isRevokable}
					className="w-full sm:w-auto"
				>
					<Trash2 className="h-4 w-4" />
					Revoke
				</Button>
			</CardHeader>
			<CardContent className="space-y-4 p-5 pt-0">
				<div className="flex flex-wrap gap-2">
					{apiKey.scopes.map((scope) => (
						<Badge key={scope} variant="secondary" className="font-mono text-xs">
							{scope}
						</Badge>
					))}
				</div>
				<div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
					<div>
						<p className="font-medium text-foreground">Created</p>
						<p>{formatDateTime(apiKey.createdAt)}</p>
					</div>
					<div>
						<p className="font-medium text-foreground">Expires</p>
						<p>{formatDateTime(apiKey.expiresAt)}</p>
					</div>
					<div>
						<p className="font-medium text-foreground">Last used</p>
						<p>{formatDateTime(apiKey.lastUsedAt)}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

const CreateApiKeyDialog = ({
	open,
	onOpenChange,
	onCreated,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreated: (apiKey: CreateApiKeyResponse) => void;
}) => {
	const { toast } = useToast();
	const createApiKeyMutation = useCreateApiKey();
	const [name, setName] = useState("");
	const [expiresAt, setExpiresAt] = useState("");
	const [scopes, setScopes] = useState<ApiKeyScope[]>([...API_KEY_SCOPES]);

	const toggleScope = (scope: ApiKeyScope) => {
		setScopes((current) =>
			current.includes(scope)
				? current.filter((currentScope) => currentScope !== scope)
				: [...current, scope],
		);
	};

	const resetForm = () => {
		setName("");
		setExpiresAt("");
		setScopes([...API_KEY_SCOPES]);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!name.trim()) {
			toast({ title: "Name is required", description: "Enter a name for this API key.", variant: "destructive" });
			return;
		}

		if (scopes.length === 0) {
			toast({ title: "Select at least one scope", description: "API keys must have one or more scopes.", variant: "destructive" });
			return;
		}

		try {
			const createdApiKey = await createApiKeyMutation.mutateAsync({
				name: name.trim(),
				scopes,
				expiresAt: expiresAt ? `${expiresAt}:00` : null,
			});

			resetForm();
			onOpenChange(false);
			onCreated(createdApiKey);
		} catch (error) {
			toast({
				title: "Failed to create API key",
				description: getErrorMessage(error, "Please try again."),
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Create API key</DialogTitle>
					<DialogDescription>
						Create a scoped key for automation. The secret is shown only once after creation.
					</DialogDescription>
				</DialogHeader>
				<form className="space-y-5" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<Label htmlFor="api-key-name">Name</Label>
						<Input
							id="api-key-name"
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder="GitHub Actions publisher"
							disabled={createApiKeyMutation.isPending}
						/>
					</div>
					<div className="space-y-3">
						<Label>Scopes</Label>
						<div className="grid gap-3 sm:grid-cols-2">
							{API_KEY_SCOPES.map((scope) => (
								<label key={scope} className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm hover:bg-accent">
									<input
										type="checkbox"
										checked={scopes.includes(scope)}
										onChange={() => toggleScope(scope)}
										disabled={createApiKeyMutation.isPending}
										className="mt-1"
									/>
									<span>
										<span className="block font-medium">{SCOPE_LABELS[scope]}</span>
										<span className="font-mono text-xs text-muted-foreground">{scope}</span>
									</span>
								</label>
							))}
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="api-key-expires-at">Expiration (optional)</Label>
						<Input
							id="api-key-expires-at"
							type="datetime-local"
							value={expiresAt}
							onChange={(event) => setExpiresAt(event.target.value)}
							disabled={createApiKeyMutation.isPending}
						/>
						<p className="text-xs text-muted-foreground">Leave empty to create a key without an expiration date.</p>
					</div>
					<DialogFooter className="gap-2 sm:gap-0">
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createApiKeyMutation.isPending}>
							Cancel
						</Button>
						<Button type="submit" className="bg-luigi-green text-white hover:bg-luigi-green/90" disabled={createApiKeyMutation.isPending}>
							{createApiKeyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
							Create key
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

const SecretDialog = ({ apiKey, onClose }: { apiKey: CreateApiKeyResponse | null; onClose: () => void }) => {
	const { toast } = useToast();

	const copySecret = async () => {
		if (!apiKey) return;

		try {
			await navigator.clipboard.writeText(apiKey.secretKey);
			toast({ title: "Copied", description: "API key secret copied to clipboard." });
		} catch {
			toast({ title: "Copy failed", description: "Select and copy the secret manually.", variant: "destructive" });
		}
	};

	return (
		<Dialog open={!!apiKey} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Save this API key now</DialogTitle>
					<DialogDescription>
						This secret is shown only once. Store it securely before closing this dialog.
					</DialogDescription>
				</DialogHeader>
				{apiKey ? (
					<div className="space-y-4">
						<div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
							Do not share this secret. It cannot be viewed again after you close this dialog.
						</div>
						<div className="space-y-2">
							<Label>Secret key</Label>
							<div className="flex flex-col gap-2 sm:flex-row">
								<code className="min-w-0 flex-1 overflow-x-auto rounded-md border bg-muted p-3 text-xs">{apiKey.secretKey}</code>
								<Button type="button" variant="outline" onClick={copySecret}>
									<Copy className="h-4 w-4" />
									Copy
								</Button>
							</div>
						</div>
						<div className="text-sm text-muted-foreground">
							Created <span className="font-medium text-foreground">{apiKey.name}</span> with prefix <span className="font-mono">{apiKey.prefix}</span>.
						</div>
					</div>
				) : null}
				<DialogFooter>
					<Button type="button" onClick={onClose}>I saved this key</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

const RevokeDialog = ({
	apiKey,
	onClose,
}: {
	apiKey: ApiKey | null;
	onClose: () => void;
}) => {
	const { toast } = useToast();
	const revokeApiKeyMutation = useRevokeApiKey();

	const handleRevoke = async () => {
		if (!apiKey) return;

		try {
			await revokeApiKeyMutation.mutateAsync(apiKey.id);
			toast({ title: "API key revoked", description: `${apiKey.name} can no longer be used.` });
			onClose();
		} catch (error) {
			toast({
				title: "Failed to revoke API key",
				description: getErrorMessage(error, "Please try again."),
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={!!apiKey} onOpenChange={(open) => !open && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Revoke API key?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. Requests using this key will stop working immediately.
					</DialogDescription>
				</DialogHeader>
				{apiKey ? (
					<div className="rounded-lg border bg-muted p-4 text-sm">
						<p className="font-medium">{apiKey.name}</p>
						<p className="font-mono text-xs text-muted-foreground">Prefix: {apiKey.prefix}</p>
					</div>
				) : null}
				<DialogFooter className="gap-2 sm:gap-0">
					<Button type="button" variant="outline" onClick={onClose} disabled={revokeApiKeyMutation.isPending}>Cancel</Button>
					<Button type="button" variant="destructive" onClick={handleRevoke} disabled={revokeApiKeyMutation.isPending}>
						{revokeApiKeyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
						Revoke key
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export const AdminApiKeysPage = () => {
	const credentials = useAuthStore((state) => state.credentials);
	const isAdmin = credentials?.role === "ADMIN";
	const { data, isError, isLoading, isFetching, refetch } = useQuery({
		...apiKeyQueries.list(),
		enabled: isAdmin,
	});
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [createdApiKey, setCreatedApiKey] = useState<CreateApiKeyResponse | null>(null);
	const [apiKeyToRevoke, setApiKeyToRevoke] = useState<ApiKey | null>(null);

	if (!isAdmin) {
		return (
			<main className="container mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center gap-4 px-4 py-12 text-center">
				<ShieldAlert className="h-12 w-12 text-muted-foreground" />
				<div className="space-y-2">
					<h1 className="text-2xl font-bold">Admin access required</h1>
					<p className="text-muted-foreground">Sign in with an admin account to manage API keys.</p>
				</div>
			</main>
		);
	}

	const apiKeys = data?.apiKeys ?? [];

	return (
		<main className="container mx-auto max-w-5xl px-4 py-8 sm:py-12">
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="space-y-2">
					<div className="flex items-center gap-2 text-sm font-medium text-luigi-green">
						<KeyRound className="h-4 w-4" />
						Admin
					</div>
					<h1 className="text-3xl font-bold tracking-tight">API keys</h1>
					<p className="max-w-2xl text-muted-foreground">
						Create and revoke scoped API keys for trusted automation. Secrets are displayed only at creation time.
					</p>
				</div>
				<div className="flex flex-col gap-2 sm:flex-row">
					<Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
						<RefreshCw className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
						Refresh
					</Button>
					<Button className="bg-luigi-green text-white hover:bg-luigi-green/90" onClick={() => setIsCreateOpen(true)}>
						<Plus className="h-4 w-4" />
						Create API key
					</Button>
				</div>
			</div>

			{isLoading ? (
				<div className="flex min-h-64 items-center justify-center rounded-xl border bg-card">
					<div className="flex items-center gap-2 text-muted-foreground">
						<Loader2 className="h-5 w-5 animate-spin" />
						Loading API keys...
					</div>
				</div>
			) : null}

			{isError ? (
				<div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
					<h2 className="font-semibold text-destructive">Failed to load API keys</h2>
					<p className="mt-2 text-sm text-muted-foreground">Check your admin session and try again.</p>
					<Button variant="outline" className="mt-4" onClick={() => refetch()}>
						Retry
					</Button>
				</div>
			) : null}

			{!isLoading && !isError && apiKeys.length === 0 ? (
				<div className="rounded-xl border bg-card p-10 text-center">
					<KeyRound className="mx-auto h-10 w-10 text-muted-foreground" />
					<h2 className="mt-4 text-xl font-semibold">No API keys yet</h2>
					<p className="mt-2 text-muted-foreground">Create a scoped API key to connect external automation.</p>
					<Button className="mt-6 bg-luigi-green text-white hover:bg-luigi-green/90" onClick={() => setIsCreateOpen(true)}>
						<Plus className="h-4 w-4" />
						Create API key
					</Button>
				</div>
			) : null}

			{!isLoading && !isError && apiKeys.length > 0 ? (
				<div className="grid gap-4">
					{apiKeys.map((apiKey) => (
						<ApiKeyCard key={apiKey.id} apiKey={apiKey} onRevoke={setApiKeyToRevoke} />
					))}
				</div>
			) : null}

			<CreateApiKeyDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onCreated={setCreatedApiKey} />
			<SecretDialog apiKey={createdApiKey} onClose={() => setCreatedApiKey(null)} />
			<RevokeDialog apiKey={apiKeyToRevoke} onClose={() => setApiKeyToRevoke(null)} />
		</main>
	);
};
