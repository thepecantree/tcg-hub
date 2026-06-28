import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    API_BASE_URL,
} from "./config";

const TOKEN_KEY =
    "auth-token";

export async function apiFetch(
    path: string,
    init: RequestInit = {}
) {
    const token =
        await AsyncStorage.getItem(
            TOKEN_KEY
        );

    const headers = {
        ...(init.headers ?? {}),

        "Content-Type":
            "application/json",

        ...(token
            ? {
                Authorization:
                    `Bearer ${token}`,
            }
            : {}),
    };

    return fetch(
        `${API_BASE_URL}${path}`,
        {
            ...init,
            headers,
        }
    );
}

export async function apiFetchWithToken(
    path: string,
    token: string,
    init: RequestInit = {}
) {
    const headers: HeadersInit = {
        ...(init.headers ?? {}),
        ...(init.body
            ? {
                "Content-Type": "application/json",
            }
            : {}),
        Authorization: `Bearer ${token}`,
    };

    return fetch(
        `${API_BASE_URL}${path}`,
        {
            ...init,
            headers,
        }
    );
}