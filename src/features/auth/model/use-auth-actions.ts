import { logout } from "@/entities/auth";
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

    return {
        handleLogin,
        handleLogout,
    };
};
