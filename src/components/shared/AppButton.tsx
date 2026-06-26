import { Pressable, Text } from "react-native";
import { useTheme } from "@/theme/ThemeContext";

type AppButtonProps = {
    label: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "danger";
};

export default function AppButton({
    label,
    onPress,
    variant = "primary",
}: AppButtonProps) {
    const { theme } = useTheme();

    const backgroundColor =
        variant === "danger"
            ? "#EF4444"
            : variant === "secondary"
                ? theme.colors.surface
                : theme.colors.primary;

    const color = variant === "secondary" ? theme.colors.text : "white";

    return (
        <Pressable
            onPress={onPress}
            style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 999,
                backgroundColor,
                borderWidth: variant === "secondary" ? 1 : 0,
                borderColor: theme.colors.border,
            }}
        >
            <Text style={{ color, fontWeight: "700" }}>{label}</Text>
        </Pressable>
    );
}