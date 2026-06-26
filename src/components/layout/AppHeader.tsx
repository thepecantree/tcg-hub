import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeContext";

type AppHeaderProps = {
    title?: string;
    showBack?: boolean;
    showDefaultActions?: boolean;
    rightContent?: React.ReactNode;
};

export default function AppHeader({
    title,
    showBack = false,
    showDefaultActions = true,
    rightContent,
}: AppHeaderProps) {
    const { theme } = useTheme();

    return (
        <View
            style={{
                height: 56,
                paddingHorizontal: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: theme.colors.surface,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    flex: 1,
                }}
            >
                {showBack && (
                    <Pressable
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace("/(tabs)/hubs");
                            }
                        }}
                        style={{
                            paddingVertical: 6,
                            paddingHorizontal: 10,
                            borderRadius: 999,
                            backgroundColor: theme.colors.surfaceAlt,
                        }}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={22}
                            color={theme.colors.text}
                        />
                    </Pressable>
                )}

                {!!title && (
                    <Text
                        numberOfLines={1}
                        style={{
                            flex: 1,
                            color: theme.colors.text,
                            fontSize: 22,
                            fontWeight: "700",
                        }}
                    >
                        {title}
                    </Text>
                )}
            </View>

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                }}
            >
                {showDefaultActions && (
                    <>
                        <Pressable onPress={() => router.push("/(tabs)/settings")}>
                            <Ionicons
                                name="settings-outline"
                                size={23}
                                color={theme.colors.text}
                            />
                        </Pressable>

                        <Pressable onPress={() => router.push("/(tabs)/inbox")}>
                            <Ionicons
                                name="mail-outline"
                                size={23}
                                color={theme.colors.text}
                            />
                        </Pressable>
                    </>
                )}

                {rightContent}
            </View>
        </View>
    );
}