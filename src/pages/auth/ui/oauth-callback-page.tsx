import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCredentials } from "@/entities/auth/api/auth.api";
import { useAuthStore } from "@/entities/auth/model/auth.store";

export const OAuthCallbackPage = () => {
    const navigate = useNavigate();
    const { setCredentials } = useAuthStore();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // 1. Validate & Verify Session directly via API
                // Since cookies are HttpOnly, we cannot read them. We rely on browser sending them.
                console.log("Attempting session verification via HttpOnly cookie...");
                const credentials = await getMyCredentials();

                if (credentials.data) {
                    setCredentials(credentials.data);
                    console.log("OAuth Login Successful");
                    navigate("/", { replace: true });
                    return;
                }

                // If verification failed
                throw new Error("Session verification failed");
            } catch (error) {
                console.error("OAuth Callback Failed:", error);
                // navigate("/") is safer if /login doesn't exist, 
                // but usually back to home if auth fails.
                navigate("/", { replace: true });
            }
        };

        handleCallback();
    }, [navigate, setCredentials]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-gradient-to-b from-background to-secondary/20">
            <div className="relative">
                {/* Outer spin */}
                <div className="h-20 w-20 animate-spin rounded-full border-4 border-luigi-green/20 border-t-luigi-green" />
                {/* Inner spin (reverse) */}
                <div className="absolute inset-2 h-16 w-16 animate-[spin_1.5s_linear_infinite_reverse] rounded-full border-4 border-luigi-blue/20 border-t-luigi-blue" />
            </div>

            <div className="flex flex-col items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Luigi Log
                </h1>
                <p className="text-sm font-medium text-muted-foreground animate-pulse">
                    GitHub로 안전하게 로그인하는 중입니다...
                </p>
            </div>

            <div className="mt-8 flex gap-1">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="h-2 w-2 rounded-full bg-luigi-green/60 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
        </div>
    );
};
