import { Image, View } from "react-native";
import { useTheme } from "@/theme/ThemeContext";
import CardEntryList from "@/components/CardEntryList";
import { UserCardEntry } from "@/types/cards";

type DeckPreviewPanelProps = {
    faceCardImage?: string | null;
    previewCard?: UserCardEntry | null;
};

export default function DeckPreviewPanel({
    faceCardImage,
    previewCard,
}: DeckPreviewPanelProps) {
    const { theme } = useTheme();

    return (
        <View style={{ width: 260 }}>
            <Image
                source={{
                    uri:
                        previewCard?.imageSmall ??
                        faceCardImage ??
                        "https://placehold.co/300x420/png",
                }}
                style={{
                    width: 240,
                    height: 335,
                    borderRadius: 12,
                    backgroundColor: theme.colors.surfaceAlt,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                }}
            />
        </View>
    );
}