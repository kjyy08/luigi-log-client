import { logout, deleteMember } from "@/entities/auth";
import { useAuthStore } from "@/entities/auth";
import { API_BASE_URL } from "@/shared/config";

export const useAuthActions = () => {
    const { logout: logoutAction } = useAuthStore();

    const handleLogin = () => {
        // Redirect to Backend OAuth2 endpoint
        window.location.href = `${API_BASE_URL}/oauth2/authorization/github`;
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (e) {
            console.error("Logout failed", e);
        } finally {
            logoutAction(); // Clear store
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone and all data will be lost."
        );

        if (!confirmed) return;

        try {
            await deleteMember();
            logoutAction(); // Clear store
            window.location.href = "/"; // Redirect to home
        } catch (e) {
            console.error("Account deletion failed", e);
            alert("Failed to delete account. Please try again.");
        }
    };

    return {
        handleLogin,
        handleLogout,
        handleDeleteAccount,
    };
};
