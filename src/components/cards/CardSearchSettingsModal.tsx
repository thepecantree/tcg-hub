import {
    Modal,
    Pressable,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeContext";

import type {
    CardSearchMode,
} from "@/types/cards";

type Props = {
    visible: boolean;

    searchMode: CardSearchMode;

    onClose: () => void;

    onChangeMode: (
        mode: CardSearchMode
    ) => void;
};

export default function CardSearchSettingsModal({
    visible,
    searchMode,
    onClose,
    onChangeMode,
}: Props) {
    const { theme } =
        useTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                onPress={onClose}
                style={{
                    flex: 1,
                    backgroundColor:
                        "rgba(0,0,0,.55)",
                    justifyContent:
                        "center",
                    alignItems:
                        "center",
                    padding: 20,
                }}
            >
                <Pressable
                    onPress={(event) =>
                        event.stopPropagation()
                    }
                    style={{
                        backgroundColor:
                            theme.colors.surface,
                        borderRadius: 16,
                        padding: 16,
                        width: "100%",
                        maxWidth: 340,
                    }}
                >
                    <View
                        style={{
                            flexDirection:
                                "row",
                            alignItems:
                                "center",
                            justifyContent:
                                "space-between",
                            marginBottom: 12,
                        }}
                    >
                        <Text
                            style={{
                                color:
                                    theme.colors.text,
                                fontWeight:
                                    "800",
                                fontSize: 20,
                            }}
                        >
                            Search Settings
                        </Text>

                        <Pressable
                            onPress={onClose}
                            style={{
                                width: 34,
                                height: 34,
                                borderRadius: 17,
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                backgroundColor:
                                    theme.colors.surfaceAlt,
                            }}
                        >
                            <Ionicons
                                name="close"
                                size={22}
                                color={
                                    theme.colors.text
                                }
                            />
                        </Pressable>
                    </View>

                    <Pressable
                        onPress={() =>
                            onChangeMode(
                                "string"
                            )
                        }
                        style={{
                            padding: 12,
                            borderRadius: 10,
                            marginBottom: 8,
                            backgroundColor:
                                searchMode ===
                                    "string"
                                    ? theme.colors.primary
                                    : theme.colors.surfaceAlt,
                        }}
                    >
                        <Text
                            style={{
                                color:
                                    theme.colors.text,
                            }}
                        >
                            Exact string match
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() =>
                            onChangeMode(
                                "server"
                            )
                        }
                        style={{
                            padding: 12,
                            borderRadius: 10,
                            backgroundColor:
                                searchMode ===
                                    "server"
                                    ? theme.colors.primary
                                    : theme.colors.surfaceAlt,
                        }}
                    >
                        <Text
                            style={{
                                color:
                                    theme.colors.text,
                            }}
                        >
                            Expanded search
                        </Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    );
}