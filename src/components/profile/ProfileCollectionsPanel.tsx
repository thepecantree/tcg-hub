import { View } from "react-native";

import ProfileTradeBinderPreview from "@/components/profile/ProfileTradeBinderPreview";
import ProfileWishlistPreview from "@/components/profile/ProfileWishlistPreview";

import type {
    UserCardEntry,
} from "@/types/cards";

type ProfileCollectionsPanelProps = {
    userId: string;

    collection?: UserCardEntry[];

    wishlist?: UserCardEntry[];

    editable?: boolean;
};

export default function ProfileCollectionsPanel({
    userId,
    collection,
    wishlist,
    editable = false,
}: ProfileCollectionsPanelProps) {
    return (
        <View
            style={{
                width: "100%",
            }}
        >
            {collection !== undefined && (
                <ProfileTradeBinderPreview
                    userId={userId}
                    cards={collection}
                    editable={editable}
                />
            )}

            {wishlist !== undefined && (
                <ProfileWishlistPreview
                    userId={userId}
                    cards={wishlist}
                    editable={editable}
                />
            )}
        </View>
    );
}