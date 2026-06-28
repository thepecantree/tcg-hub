import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    apiFetch,
    apiFetchWithToken,
} from "@/api/client";

export type AuthUser = {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    location?: string;
    bio?: string;
    createdAt?: string;
};

type AuthContextValue = {
    user: AuthUser | null;

    token: string | null;

    loading: boolean;

    setUserFromServer: (
        user: AuthUser
    ) => void;

    login: (
        identifier: string
    ) => Promise<boolean>;

    logout: () => Promise<void>;
};

const AuthContext =
    createContext<AuthContextValue>({
        user: null,
        token: null,
        loading: true,

        setUserFromServer:
            () => { },

        login: async () => false,

        logout: async () => { },
    });

const TOKEN_KEY =
    "auth-token";

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [
        user,
        setUser,
    ] = useState<AuthUser | null>(
        null
    );

    const [
        token,
        setToken,
    ] = useState<string | null>(
        null
    );

    const [
        loading,
        setLoading,
    ] = useState(true);

    useEffect(() => {
        initialize();
    }, []);

    async function initialize() {
        try {
            const storedToken =
                await AsyncStorage.getItem(
                    TOKEN_KEY
                );

            if (!storedToken) {
                setLoading(
                    false
                );

                return;
            }

            const response =
                await apiFetchWithToken(
                    "/auth/me",
                    storedToken
                );

            if (!response.ok) {
                await AsyncStorage.removeItem(
                    TOKEN_KEY
                );

                setLoading(
                    false
                );

                return;
            }

            const data =
                await response.json();

            setToken(
                storedToken
            );

            setUser(
                data.user
            );
        } catch {
            await AsyncStorage.removeItem(
                TOKEN_KEY
            );
        }

        setLoading(
            false
        );
    }

    function setUserFromServer(
        nextUser: AuthUser
    ) {
        setUser(
            nextUser
        );
    }

    async function login(
        identifier: string
    ) {
        try {
            const response =
                await apiFetch(
                    "/auth/login",
                    {
                        method: "POST",
                        body:
                            JSON.stringify({
                                identifier,
                            }),
                    }
                );

            if (
                !response.ok
            ) {
                return false;
            }

            const data =
                await response.json();

            await AsyncStorage.setItem(
                TOKEN_KEY,
                data.token
            );

            setToken(
                data.token
            );

            setUser(
                data.user
            );

            return true;
        } catch {
            return false;
        }
    }

    async function logout() {
        try {
            if (token) {
                await apiFetchWithToken(
    "/auth/logout",
    token,
    {
        method: "POST",
    }
);
            }
        } catch { }

        await AsyncStorage.removeItem(
            TOKEN_KEY
        );

        setToken(
            null
        );

        setUser(
            null
        );
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,

                setUserFromServer,

                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(
        AuthContext
    );
}