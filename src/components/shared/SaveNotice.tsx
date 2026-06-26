import { Text, View } from "react-native";

import { useTheme } from "@/theme/ThemeContext";

type SaveNoticeProps = {
    message: string;
};

export default function SaveNotice({
    message,
}: SaveNoticeProps) {
    const { theme } = useTheme();

    if (!message) {
        return null;
    }

    return (
        <View
            style={{
                position: "absolute",
                left: 16,
                bottom: 16,
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 999,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
            }}
        >
            <Text
                style={{
                    color: theme.colors.primary,
                    fontWeight: "700",
                }}
            >
                {message}
            </Text>
        </View>
    );
}