import {
    FlatList,
    Image,
    Modal,
    Pressable,
    Text,
    View,
} from "react-native";

import { useTheme } from "@/theme/ThemeContext";

import {
    CardPrinting,
} from "@/types/cards";

type PrintingPickerModalProps = {
    visible: boolean;

    printings: CardPrinting[];

    onSelect: (
        printing: CardPrinting
    ) => void;

    onClose: () => void;
};

export default function PrintingPickerModal({
    visible,
    printings,
    onSelect,
    onClose,
}: PrintingPickerModalProps) {

    const { theme } =
        useTheme();

    return (
        <Modal
            visible={
                visible
            }
            transparent
            animationType="fade"
            onRequestClose={
                onClose
            }
        >
            <View
                style={{
                    flex: 1,

                    backgroundColor:
                        "rgba(0,0,0,0.65)",

                    justifyContent:
                        "center",

                    padding: 20,
                }}
            >
                <View
                    style={{
                        maxHeight:
                            "80%",

                        backgroundColor:
                            theme.colors.surface,

                        borderRadius: 16,

                        padding: 16,

                        borderWidth: 1,

                        borderColor:
                            theme.colors.border,
                    }}
                >
                    <Text
                        style={{
                            color:
                                theme.colors.text,

                            fontSize: 20,

                            fontWeight:
                                "700",

                            marginBottom: 12,
                        }}
                    >
                        Select Printing
                    </Text>

                    <FlatList
                        data={
                            printings
                        }
                        keyExtractor={(
                            item
                        ) =>
                            item.scryfallId
                        }
                        renderItem={({
                            item,
                        }) => (
                            <Pressable
                                onPress={() =>
                                    onSelect(
                                        item
                                    )
                                }
                                style={{
                                    flexDirection:
                                        "row",

                                    gap: 10,

                                    paddingVertical: 10,

                                    borderBottomWidth: 1,

                                    borderBottomColor:
                                        theme.colors.border,
                                }}
                            >
                                {item.imageSmall ? (
                                    <Image
                                        source={{
                                            uri:
                                                item.imageSmall,
                                        }}
                                        style={{
                                            width: 42,
                                            height: 58,
                                            borderRadius: 5,
                                        }}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            width: 42,
                                            height: 58,
                                            borderRadius: 5,
                                            backgroundColor:
                                                theme.colors.surfaceAlt,
                                        }}
                                    />
                                )}

                                <View
                                    style={{
                                        flex: 1,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color:
                                                theme.colors.text,

                                            fontWeight:
                                                "700",
                                        }}
                                    >
                                        {item.setName}
                                        {" "}
                                        (
                                        {item.setCode?.toUpperCase()}
                                        )
                                    </Text>

                                    <Text
                                        style={{
                                            color:
                                                theme.colors.textMuted,
                                        }}
                                    >
                                        #
                                        {item.collectorNumber}
                                        {" • "}
                                        {item.rarity}
                                    </Text>
                                </View>
                            </Pressable>
                        )}
                    />

                    <Pressable
                        onPress={
                            onClose
                        }
                        style={{
                            marginTop: 12,
                            padding: 12,
                            borderRadius: 10,
                            backgroundColor:
                                theme.colors.primary,
                            alignItems:
                                "center",
                        }}
                    >
                        <Text
                            style={{
                                color:
                                    "white",
                                fontWeight:
                                    "700",
                            }}
                        >
                            Close
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}