import { Pressable, Text, TextInput, View } from "react-native";

import { useTheme } from "@/theme/ThemeContext";

type CardAddInputProps = {
    title: string;
    value: string;
    onChangeText: (value: string) => void;
    onAdd: () => void;
};

export default function CardAddInput({
    title,
    value,
    onChangeText,
    onAdd,
}: CardAddInputProps) {
    const { theme } = useTheme();

    const hasText =
        value.trim().length > 0;

    return (
        <View
            style={{
                position: "relative",
                marginTop: 12,
            }}
        >
            <TextInput
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={onAdd}
                placeholder={`Add card to ${title.toLowerCase()}...`}
                placeholderTextColor={theme.colors.textMuted}
                style={{
                    padding: 10,
                    paddingRight: hasText ? 68 : 10,
                    borderRadius: 10,
                    backgroundColor: theme.colors.surfaceAlt,
                    color: theme.colors.text,
                }}
            />

            {hasText && (
                <Pressable
                    onPress={onAdd}
                    style={{
                        position: "absolute",
                        right: 4,
                        top: 4,
                        bottom: 4,
                        width: 58,
                        borderRadius: 8,
                        backgroundColor: theme.colors.primary,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        Add
                    </Text>
                </Pressable>
            )}
        </View>
    );
}