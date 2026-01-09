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
            "정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 데이터가 삭제됩니다."
        );

        if (!confirmed) return;

        try {
            await deleteMember();
            logoutAction(); // Clear store
            window.location.href = "/"; // Redirect to home
        } catch (e) {
            console.error("Account deletion failed", e);
            alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return {
        handleLogin,
        handleLogout,
        handleDeleteAccount,
    };
};
