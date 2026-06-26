import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/theme/ThemeContext";

export default function TradeUserPage() {
    const { theme } =
        useTheme();

    const { userId } =
        useLocalSearchParams<{
            userId: string;
        }>();

    return (
        <View
            style={{
                flex: 1,
                padding: 20,
                backgroundColor:
                    theme.colors.background,
            }}
        >
            <Text
                style={{
                    color: theme.colors.text,
                    fontSize: 24,
                    fontWeight: "800",
                }}
            >
                Trade
            </Text>

            <Text
                style={{
                    color:
                        theme.colors.textMuted,
                    marginTop: 10,
                }}
            >
                User ID:
                {" "}
                {userId}
            </Text>

            <Text
                style={{
                    color:
                        theme.colors.textMuted,
                    marginTop: 20,
                }}
            >
                Trade placeholder
            </Text>
        </View>
    );
}