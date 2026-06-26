export function mapDeck(row: any) {
    const visibility =
        row.visibility ??
        (row.isPublic ? "public" : "private");

    return {
        id: row.id,
        userId: row.userId,
        name: row.name,
        faceCardName: row.faceCardName,
        faceCardImage: row.faceCardImage,
        isPublic: visibility === "public",
        visibility,
        format: row.format,
        powerLevel: row.powerLevel,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}

export function mapDeckCard(row: any) {
    return {
        id: row.id,
        deckId: row.deckId,

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