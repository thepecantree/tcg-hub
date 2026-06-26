import {
    apiFetch,
} from "@/api/client";

export type ServerUser = {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    location: string;
    bio: string;
    createdAt: string;
};

export async function fetchUserProfile(
    userId: string
) {
    const response =
        await apiFetch(
            `/users/${encodeURIComponent(
                userId
            )}`
        );

    if (!response.ok) {
        const data =
            await response.json().catch(
                () => null
            );

        throw new Error(
            data?.error ??
            `Could not load user profile. Status ${response.status}`
        );
    }

    const data =
        await response.json();

    return data.user as ServerUser;
}

export async function updateUserProfile(
    userId: string,
    profile: {
        displayName: string;
        username: string;
        avatar: string;
        bio: string;
    }
) {
    const response =
        await apiFetch(
            `/users/${encodeURIComponent(
                userId
            )}`,
            {
                method: "PATCH",
                body: JSON.stringify(
                    profile
                ),
            }
        );

    if (!response.ok) {
        const data =
            await response.json().catch(
                () => null
            );

        throw new Error(
            data?.error ??
            `Could not save user profile. Status ${response.status}`
        );
    }

    const data =
        await response.json();

    return data.user as ServerUser;
}