import {
    useAuth,
} from "@/auth/AuthContext";

export function useCurrentUser() {
    const {
        user,
    } = useAuth();

    return {
        currentUserId:
            user?.id ??
            null,

        currentUsername:
            user?.username ??
            "",

        currentDisplayName:
            user?.displayName ??
            "",

        currentAvatar:
            user?.avatar ??
            "",

        currentLocation:
            user?.location ??
            "",

        currentBio:
            user?.bio ??
            "",
    };
}