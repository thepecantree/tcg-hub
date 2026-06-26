import fs from "fs";
import path from "path";
import JSONStream from "JSONStream";

import db from "./db";

type ScryfallBulkItem = {
    type: string;
    download_uri: string;
};

type ScryfallCard = {
    id: string;
    oracle_id?: string;
    name: string;
    set_name?: string;
    set?: string;
    collector_number?: string;
    lang?: string;
    released_at?: string;
    type_line?: string;
    rarity?: string;
    cmc?: number;
    colors?: string[];
    image_uris?: {
        small?: string;
        normal?: string;
    };
    card_faces?: {
        image_uris?: {
            small?: string;
            normal?: string;
        };
    }[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const BULK_FILE_PATH = path.join(DATA_DIR, "all_cards.json");

async function downloadFile(url: string, destination: string) {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const response = await fetch(url);

    if (!response.ok || !response.body) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }

    const fileStream = fs.createWriteStream(destination);

    await new Promise<void>((resolve, reject) => {
        response.body!.pipeTo(
            new WritableStream({
                write(chunk) {
                    fileStream.write(Buffer.from(chunk));
                },
                close() {
                    fileStream.end();
                    resolve();
                },
                abort(error) {
                    fileStream.destroy();
                    reject(error);
                },
            })
        ).catch(reject);
    });
}

async function getAllCardsDownloadUri() {
    const response = await fetch("https://api.scryfall.com/bulk-data");

    if (!response.ok) {
        throw new Error(`Failed to fetch bulk metadata: ${response.statusText}`);
    }

    const bulkJson = await response.json();

    const allCards = bulkJson.data.find(
        (item: ScryfallBulkItem) => item.type === "all_cards"
    );

    if (!allCards?.download_uri) {
        throw new Error("Could not find all_cards download_uri.");
    }

    return allCards.download_uri;
}

const insert = db.prepare(`
  INSERT OR REPLACE INTO cards (
    scryfall_id,
    oracle_id,
    name,
    set_name,
    set_code,
    collector_number,
    lang,
    released_at,
    type_line,
    rarity,
    mana_value,
    colors,
    image_small,
    image_normal
  )
  VALUES (
    @scryfall_id,
    @oracle_id,
    @name,
    @set_name,
    @set_code,
    @collector_number,
    @lang,
    @released_at,
    @type_line,
    @rarity,
    @mana_value,
    @colors,
    @image_small,
    @image_normal
  )
`);

const insertMany = db.transaction((cards: ScryfallCard[]) => {
    for (const card of cards) {
        const imageUris = card.image_uris ?? card.card_faces?.[0]?.image_uris;

        insert.run({
            scryfall_id: card.id,
            oracle_id: card.oracle_id ?? null,
            name: card.name,
            set_name: card.set_name ?? null,
            set_code: card.set ?? null,
            collector_number: card.collector_number ?? null,
            lang: card.lang ?? null,
            released_at: card.released_at ?? null,
            type_line: card.type_line ?? null,
            rarity: card.rarity ?? null,
            mana_value: card.cmc ?? null,
            colors: card.colors ? JSON.stringify(card.colors) : null,
            image_small: imageUris?.small ?? null,
            image_normal: imageUris?.normal ?? null,
        });
    }
});

async function syncScryfall() {
    console.log("\nFetching Scryfall bulk metadata...");
    const downloadUri = await getAllCardsDownloadUri();

    console.log("Downloading all_cards bulk file...");
    await downloadFile(downloadUri, BULK_FILE_PATH);

    console.log("Clearing old card rows...");
    db.exec("DELETE FROM cards");

    console.log("Streaming cards into SQLite...\n");

    let count = 0;
    let batch: ScryfallCard[] = [];
    const BATCH_SIZE = 1000;

    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(BULK_FILE_PATH)
            .pipe(JSONStream.parse("*"))
            .on("data", (card: ScryfallCard) => {
                batch.push(card);

                if (batch.length >= BATCH_SIZE) {
                    insertMany(batch);
                    count += batch.length;
                    batch = [];
                    process.stdout.write(`Imported ${count}\r`);
                }
            })
            .on("end", () => {
                if (batch.length > 0) {
                    insertMany(batch);
                    count += batch.length;
                }

                console.log(`\n\nFinished importing ${count} cards.\n`);
                resolve();
            })
            .on("error", reject);
    });
}

syncScryfall().catch((error) => {
    console.error(error);
    process.exit(1);
});