export function cardSelectSql() {
    return `
        SELECT
            scryfall_id as scryfallId,
            oracle_id as oracleId,

            name,

            set_name as setName,
            set_code as setCode,
            collector_number as collectorNumber,

            lang,
            released_at as releasedAt,

            type_line as typeLine,

            rarity,
            mana_value as manaValue,
            colors,

            image_small as imageSmall,
            image_normal as imageNormal
        FROM cards
    `;
}