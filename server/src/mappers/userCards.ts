export function normalizeListType(
    value: unknown
) {
    const listType =
        String(value ?? "").trim();

    if (
        listType === "collection" ||
        listType === "wishlist"
    ) {
        return listType;
    }

    return null;
}

export function mapCardEntry(
    row: any
) {
    return {
        id: row.id,
        userId: row.userId,
        listType: row.listType,

        cardName: row.cardName,
        scryfallId: row.scryfallId,
        setName: row.setName,
        setCode: row.setCode,
        collectorNumber: row.collectorNumber,
        imageSmall: row.imageSmall,
        typeLine: row.typeLine,
        rarity: row.rarity,
        manaValue: row.manaValue,
        colors: row.colors,

        foil: !!row.foil,
        quantity: row.quantity,
        printSpecific: !!row.printSpecific,

        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}

export const USER_CARD_SELECT_SQL =
    `
    SELECT
        id,
        user_id as userId,
        list_type as listType,

        card_name as cardName,
        scryfall_id as scryfallId,
        set_name as setName,
        set_code as setCode,
        collector_number as collectorNumber,
        image_small as imageSmall,
        type_line as typeLine,
        rarity,
        mana_value as manaValue,
        colors,

        foil,
        quantity,
        print_specific as printSpecific,

        created_at as createdAt,
        updated_at as updatedAt

    FROM user_card_entries
    `;