import {
    Image,
    Text,
    View,
} from "react-native";

import { useTheme } from "@/theme/ThemeContext";

import {
    UserCardEntry,
} from "@/types/cards";

type CardListRowProps = {
    item: UserCardEntry;

    controls: React.ReactNode;

    first?: boolean;
};

export default function CardListRow({
    item,
    controls,
    first,
}: CardListRowProps) {

    const { theme } =
        useTheme();

    return (
        <View
            style={{
                borderTopWidth:
                    first
                        ? 0
                        : 1,

                borderTopColor:
                    theme.colors.border,

                paddingTop:
                    first
                        ? 0
                        : 10,

                marginTop:
                    first
                        ? 0
                        : 10,
            }}
        >
            <View
                style={{
                    flexDirection:
                        "row",

                    gap: 10,
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
                        {item.cardName}
                    </Text>

                    <Text
                        style={{
                            color:
                                theme.colors.textMuted,
                        }}
                    >
                        {item.setName
                            ? `${item.setName} (${item.setCode?.toUpperCase()})`
                            : "Printing not selected"}
                    </Text>

                    {controls}
                </View>
            </View>
        </View>
    );
}