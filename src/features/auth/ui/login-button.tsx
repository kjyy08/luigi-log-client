import { useAuthStore } from "@/entities/auth";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { LogOut, UserX } from "lucide-react";
import { useAuthActions } from "../model/use-auth-actions";
import { useGetMyProfile } from "@/entities/profile/model/profile.queries";
import { useUIStore } from "@/shared/store/use-ui-store";

export const LoginButton = () => {
    const { isAuthenticated, member, profile: storeProfile } = useAuthStore();
    const { handleLogout, handleDeleteAccount } = useAuthActions();

    const { data: profileQueryData } = useGetMyProfile(member?.username, { enabled: isAuthenticated && !!member?.username });
    const profile = profileQueryData || storeProfile;

    const { openLoginModal } = useUIStore();

    if (isAuthenticated) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={profile?.profileImageUrl}
                                alt={profile?.nickname || member?.username}
                            />
                            <AvatarFallback>
                                {(profile?.nickname || member?.username || "??")
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {profile?.nickname || member?.username}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {member?.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleDeleteAccount}
                        className="cursor-pointer text-destructive focus:text-destructive"
                    >
                        <UserX className="mr-2 h-4 w-4" />
                        <span>Delete account</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-destructive focus:text-destructive"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <Button
            onClick={openLoginModal}
            variant="default"
            className="h-8 px-2 text-xs font-bold text-white bg-luigi-green hover:bg-luigi-green/90 sm:h-9 sm:px-4 sm:text-sm"
        >
            Sign in
        </Button>
    );
};
