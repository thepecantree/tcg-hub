import * as FileSystem from "expo-file-system";

export async function saveUserAvatar(userId: string, sourceUri: string) {
    const avatarDir = `${FileSystem.documentDirectory}avatars/`;
    const avatarPath = `${avatarDir}${userId}.jpg`;

    const dirInfo = await FileSystem.getInfoAsync(avatarDir);

    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(avatarDir, {
            intermediates: true,
        });
    }

    const existing = await FileSystem.getInfoAsync(avatarPath);

    if (existing.exists) {
        await FileSystem.deleteAsync(avatarPath, { idempotent: true });
    }

    await FileSystem.copyAsync({
        from: sourceUri,
        to: avatarPath,
    });

    return avatarPath;
}