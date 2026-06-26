import { View } from "react-native";

import DeckListEditor from "@/components/DeckListEditor";
import DeckSectionGrid from "@/components/decks/DeckSectionGrid";

type ProfileDecksPanelProps = {
    userId: string;
    editable?: boolean;
    decks: any[];
    onChange?: (decks: any[]) => void;
};

export default function ProfileDecksPanel({
    userId,
    editable = false,
    decks,
    onChange,
}: ProfileDecksPanelProps) {
    const publicDecks =
        decks.filter(
            (deck) =>
                deck.isPublic
        );

    const draftDecks =
        decks.filter(
            (deck) =>
                !deck.isPublic
        );

    return (
        <View
            style={{
                width: "100%",
            }}
        >
            {editable ? (
                <DeckListEditor
                    userId={userId}
                    decks={decks}
                    onChange={onChange!}
                />
            ) : (
                    <DeckSectionGrid
                        ownerUserId={userId}
                        publicDecks={publicDecks}
                        draftDecks={[]}
                        showDrafts={false}
                    />
            )}
        </View>
    );
}