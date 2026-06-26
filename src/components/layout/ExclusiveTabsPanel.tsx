import { ReactNode, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeContext";

type TabItem = {
    key: string;
    title: string;
    children: ReactNode;
};

type ExclusiveTabsPanelProps = {
    tabs: TabItem[];
    defaultKey?: string;
};

export default function ExclusiveTabsPanel({
    tabs,
    defaultKey,
}: ExclusiveTabsPanelProps) {
    const { theme } = useTheme();

    const [activeKey, setActiveKey] = useState<string | null>(
        defaultKey ?? null
    );

    const activeTab = tabs.find((tab) => tab.key === activeKey);

    return (
        <View
            style={{
                width: "100%",
                backgroundColor: theme.colors.surface,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: theme.colors.border,
                marginBottom: 14,
                padding: 14,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    gap: 10,
                    marginBottom: activeTab ? 14 : 0,
                }}
            >
                {tabs.map((tab) => {
                    const active = tab.key === activeKey;

                    return (
                        <Pressable
                            key={tab.key}
                            onPress={() =>
                                setActiveKey(active ? null : tab.key)
                            }
                            style={{
                                flex: 1,
                                paddingVertical: 10,
                                paddingHorizontal: 12,
                                borderRadius: 999,
                                backgroundColor: active
                                    ? theme.colors.primary
                                    : theme.colors.surfaceAlt,
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    color: active
                                        ? "white"
                                        : theme.colors.text,
                                    fontWeight: "700",
                                }}
                            >
                                {tab.title}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {activeTab?.children}
        </View>
    );
}