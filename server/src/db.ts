import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(
    process.cwd(),
    "cards.db"
);

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS play_centers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    address TEXT,
    town TEXT,
    state TEXT,
    phone TEXT,
    website TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_play_centers_town
ON play_centers(town);

CREATE TABLE IF NOT EXISTS decks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    face_card_name TEXT,
    face_card_image TEXT,
    is_public INTEGER NOT NULL DEFAULT 0,
    visibility TEXT NOT NULL DEFAULT 'private',
    format TEXT NOT NULL DEFAULT 'Unsorted',
    power_level INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_decks_user
ON decks(user_id);

CREATE TABLE IF NOT EXISTS deck_cards (
    id TEXT PRIMARY KEY,
    deck_id TEXT NOT NULL,
    card_name TEXT NOT NULL,
    scryfall_id TEXT,
    set_name TEXT,
    set_code TEXT,
    collector_number TEXT,
    image_small TEXT,
    type_line TEXT,
    rarity TEXT,
    mana_value REAL,
    colors TEXT,
    foil INTEGER NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 1,
    print_specific INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_deck_cards_deck
ON deck_cards(deck_id);

CREATE INDEX IF NOT EXISTS idx_deck_cards_name
ON deck_cards(card_name);

CREATE TABLE IF NOT EXISTS user_card_entries (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    list_type TEXT NOT NULL,
    card_name TEXT NOT NULL,
    scryfall_id TEXT,
    set_name TEXT,
    set_code TEXT,
    collector_number TEXT,
    image_small TEXT,
    type_line TEXT,
    rarity TEXT,
    mana_value REAL,
    colors TEXT,
    foil INTEGER NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 1,
    print_specific INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_card_entries_user
ON user_card_entries(user_id);

CREATE INDEX IF NOT EXISTS idx_user_card_entries_type
ON user_card_entries(list_type);

CREATE INDEX IF NOT EXISTS idx_user_card_entries_name
ON user_card_entries(card_name);

CREATE INDEX IF NOT EXISTS idx_user_card_entries_scryfall
ON user_card_entries(scryfall_id);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    avatar TEXT,
    location TEXT,
    bio TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_user
ON sessions(user_id);

CREATE TABLE IF NOT EXISTS cards (
    scryfall_id TEXT PRIMARY KEY,
    oracle_id TEXT,
    name TEXT NOT NULL,
    set_name TEXT,
    set_code TEXT,
    collector_number TEXT,
    lang TEXT,
    released_at TEXT,
    type_line TEXT,
    rarity TEXT,
    mana_value REAL,
    colors TEXT,
    image_small TEXT,
    image_normal TEXT
);

CREATE INDEX IF NOT EXISTS idx_cards_name
ON cards(name);

CREATE INDEX IF NOT EXISTS idx_cards_set
ON cards(set_code);

CREATE INDEX IF NOT EXISTS idx_cards_oracle
ON cards(oracle_id);

CREATE INDEX IF NOT EXISTS idx_cards_release
ON cards(released_at);

CREATE INDEX IF NOT EXISTS idx_cards_type
ON cards(type_line);

CREATE INDEX IF NOT EXISTS idx_cards_rarity
ON cards(rarity);

CREATE INDEX IF NOT EXISTS idx_cards_mv
ON cards(mana_value);

CREATE TABLE IF NOT EXISTS forum_threads (
    id TEXT PRIMARY KEY,
    board_id TEXT NOT NULL,
    title TEXT NOT NULL,
    author_user_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_forum_threads_board
ON forum_threads(board_id);

CREATE TABLE IF NOT EXISTS forum_posts (
    id TEXT PRIMARY KEY,
    thread_id TEXT NOT NULL,
    author_user_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL,
    reply_to_post_id TEXT,
    author_username TEXT,
    author_avatar TEXT,
    author_join_date TEXT,
    author_post_count INTEGER
);

CREATE INDEX IF NOT EXISTS idx_forum_posts_thread
ON forum_posts(thread_id);

CREATE INDEX IF NOT EXISTS idx_forum_posts_reply
ON forum_posts(reply_to_post_id);

CREATE TABLE IF NOT EXISTS forum_reports (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    thread_id TEXT NOT NULL,
    reporter_user_id TEXT NOT NULL,
    reporter_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_forum_reports_post
ON forum_reports(post_id);
`);

function columnExists(
    tableName: string,
    columnName: string
) {
    const columns = db
        .prepare(
            `
            PRAGMA table_info(${tableName})
            `
        )
        .all() as {
            name: string;
        }[];

    return columns.some(
        (column) => column.name === columnName
    );
}

function addColumnIfMissing(
    tableName: string,
    columnName: string,
    definition: string
) {
    if (
        columnExists(
            tableName,
            columnName
        )
    ) {
        return;
    }

    db.exec(
        `
        ALTER TABLE ${tableName}
        ADD COLUMN ${columnName} ${definition}
        `
    );
}

function runMigrations() {
    addColumnIfMissing(
        "decks",
        "visibility",
        "TEXT NOT NULL DEFAULT 'private'"
    );

    db.prepare(`
    UPDATE decks
    SET visibility = CASE
        WHEN is_public = 1 THEN 'public'
        ELSE 'private'
    END
    WHERE visibility IS NULL
       OR visibility = ''
`).run();

    addColumnIfMissing(
        "forum_posts",
        "reply_to_post_id",
        "TEXT"
    );

    addColumnIfMissing(
        "forum_posts",
        "author_username",
        "TEXT"
    );

    addColumnIfMissing(
        "forum_posts",
        "author_avatar",
        "TEXT"
    );

    addColumnIfMissing(
        "forum_posts",
        "author_join_date",
        "TEXT"
    );

    addColumnIfMissing(
        "forum_posts",
        "author_post_count",
        "INTEGER"
    );

    const userOne = db
        .prepare(
            `
            SELECT username
            FROM users
            WHERE id = '1'
            LIMIT 1
            `
        )
        .get() as
        | {
            username: string;
        }
        | undefined;

    if (
        userOne &&
        userOne.username === "sql-one"
    ) {
        db.prepare(
            `
            UPDATE users
            SET username = 'sql'
            WHERE id = '1'
            `
        ).run();
    }
}

function seedUsers() {
    const seededUsers = [
        {
            id: "1",
            username: "sql",
            displayName: "Nika",
        },
        {
            id: "2",
            username: "manaforge",
            displayName: "Maya",
        },
        {
            id: "3",
            username: "topdecktheo",
            displayName: "Theo",
        },
    ];

    const insertUser = db.prepare(
        `
        INSERT OR IGNORE INTO users (
            id,
            username,
            display_name,
            avatar,
            location,
            bio,
            created_at
        )
        VALUES (
            @id,
            @username,
            @displayName,
            @avatar,
            @location,
            @bio,
            @createdAt
        )
        `
    );

    const now = new Date().toISOString();

    for (const user of seededUsers) {
        insertUser.run({
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            avatar: "https://placehold.co/300x300/png",
            location: "Ann Arbor, MI",
            bio: "",
            createdAt: now,
        });
    }
}

seedUsers();
runMigrations();

db.exec(`
DELETE FROM forum_reports
WHERE thread_id IN (
    SELECT t.id
    FROM forum_threads t
    LEFT JOIN forum_posts p
        ON p.thread_id = t.id
    GROUP BY t.id
    HAVING COUNT(p.id) = 0
);

DELETE FROM forum_threads
WHERE id IN (
    SELECT t.id
    FROM forum_threads t
    LEFT JOIN forum_posts p
        ON p.thread_id = t.id
    GROUP BY t.id
    HAVING COUNT(p.id) = 0
);
`);

export default db;