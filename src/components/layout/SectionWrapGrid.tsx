import { ReactNode } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeContext";

type SectionWrapGridProps = {
    sections: {
        title: string;
        children: ReactNode;
        emptyText?: string;
        isEmpty?: boolean;
    }[];
};

export default function SectionWrapGrid({ sections }: SectionWrapGridProps) {
    const { theme } = useTheme();

    return (
        <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 18,
                alignItems: "flex-start",
                width: "100%",
            }}
        >
            {sections.map((section) => (
                <View
                    key={section.title}
                    style={{
                        minWidth: 170,
                        maxWidth: "100%",
                        marginBottom: 16,
                    }}
                >
                    <Text
                        style={{
                            color: theme.colors.text,
                            fontWeight: "700",
                            marginBottom: 10,
                        }}
                    >
                        {section.title}
                    </Text>

                    {section.isEmpty ? (
                        <Text style={{ color: theme.colors.textMuted }}>
                            {section.emptyText}
                        </Text>
                    ) : (
                        section.children
                    )}
                </View>
            ))}
        </View>
    );
}