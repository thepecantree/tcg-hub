import {
    Image,
    Pressable,
    Text,
    View,
} from "react-native";

import { router } from "expo-router";

import { useTheme } from "@/theme/ThemeContext";

type DeckTileProps = {
    id: string;

    name: string;

    image?: string | null;
};

export default function DeckTile({
    id,
    name,
    image,
}: DeckTileProps) {

    const { theme } =
        useTheme();

    return (
        <Pressable
            onPress={() =>
                router.push(
                    `/deck-draft/${id}`
                )
            }
            style={{
                width: 58,

                marginRight: 8,

                marginBottom: 10,

                alignItems:
                    "center",
            }}
        >
            <Image
                source={{
                    uri:
                        image ??
                        "https://placehold.co/300x420/png",
                }}
                style={{
                    width: 58,

                    height: 81,

                    borderRadius: 7,

                    backgroundColor:
                        theme.colors.surfaceAlt,

                    borderWidth: 1,

                    borderColor:
                        theme.colors.border,
                }}
            />

            <Text
                numberOfLines={2}
                style={{
                    color:
                        theme.colors.text,

                    fontWeight:
                        "700",

                    marginTop: 4,

                    textAlign:
                        "center",

                    fontSize: 10,

                    lineHeight:
                        12,

                    width:
                        "100%",
                }}
            >
                {name}
            </Text>
        </Pressable>
    );
}