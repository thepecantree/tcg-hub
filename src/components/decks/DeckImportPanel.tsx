import { Pressable, Text, TextInput, View } from "react-native";
import { useTheme } from "@/theme/ThemeContext";

type DeckImportPanelProps = {
    visible: boolean;
    importText: string;
    onChangeImportText: (value: string) => void;
    onImport: () => void;
};

export default function DeckImportPanel({
    visible,
    importText,
    onChangeImportText,
    onImport,
}: DeckImportPanelProps) {
    const { theme } = useTheme();

    if (!visible) return null;

    return (
        <View
            style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 14,
                padding: 14,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: theme.colors.border,
            }}
        >
            <TextInput
                value={importText}
                onChangeText={onChangeImportText}
                multiline
                placeholder="Paste decklist here..."
                placeholderTextColor={theme.colors.textMuted}
                style={{
                    minHeight: 90,
                    maxHeight: 260,
                    color: theme.colors.text,
                    backgroundColor: theme.colors.surfaceAlt,
                    borderRadius: 10,
                    padding: 10,
                    textAlignVertical: "top",
                }}
            />

            <Pressable
                onPress={onImport}
                style={{
                    marginTop: 10,
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor: theme.colors.primary,
                    alignItems: "center",
                }}
            >
                <Text style={{ color: "white", fontWeight: "700" }}>
                    Add Cards
                </Text>
            </Pressable>
        </View>
    );
}