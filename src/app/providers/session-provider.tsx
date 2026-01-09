import { useEffect } from "react";
import { useAuthStore } from "@/entities/auth/model/auth.store";
import { getMyCredentials } from "@/entities/auth/api/auth.api";
import { getMyMemberInfo } from "@/entities/member";
import { getMyProfile } from "@/entities/profile/api/profile.api";

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const { setCredentials, setMember, setProfile } = useAuthStore();


    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await getMyCredentials();
                if (response.data) {
                    setCredentials(response.data);

                    try {
                        const member = await getMyMemberInfo();
                        if (member) {
                            setMember(member);

                            try {
                                const profile = await getMyProfile(member.username);
                                if (profile) {
                                    setProfile(profile);
                                }
                            } catch (profileError) {
                                console.error("Failed to fetch profile details", profileError);
                            }
                        }
                    } catch (memberError) {
                        console.error("Failed to fetch member details", memberError);
                    }
                }
            } catch (error) {
                // Session invalid or error - remains guest
            }
        };

        restoreSession();
    }, [setCredentials, setMember, setProfile]);

    // Optional: Show nothing or a loader while checking session to prevent UI flicker
    // For now, render children immediately to allow 'guest' view while checking? 
    // Or block? User said "logged out", they prefer to BE logged in. 
    // If we render immediately, it looks like logout -> login.
    // Let's render immediately but maybe the header will flicker.
    // For better UX, we might want to block only if we think we SHOULD be logged in? 
    // But we don't know without checking.
    // Let's just return children. If user wants to block, we can add loader.
    return <>{children}</>;
};
