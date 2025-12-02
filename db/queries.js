import pool from "./pool.js";

// convert genres to an array instead of duplicate game rows and change names
function convertGameRowsToObjects(gameRows) {
    const map = new Map();

    for (const row of gameRows) {
        if (map.has(row.id)) {
            map.get(row.id).genres.push({
                id: row["genre_id"],
                name: row["genre"],
            });
        } else {
            map.set(row.id, {
                id: row.id,
                title: row.title,
                genres: row["genre_id"]
                    ? [{ id: row["genre_id"], name: row["genre"] }]
                    : [],
                description: row.description,
                developer: row.developer,
                year: row.year,
                price: row.price,
                imageUrl: row["image_url"],
            });
        }
    }

    return Array.from(map.values());
}

async function getGameById(gameId) {
    const { rows } = await pool.query(
        `
        SELECT g.*, ge.name genre, ge.id genre_id FROM games g LEFT JOIN
        game_genres gg ON g.id = gg.game_id LEFT JOIN 
        genres ge ON ge.id = gg.genre_id
        WHERE g.id = $1;
        `,
        [gameId]
    );

    if (rows.length === 0) return null;

    return convertGameRowsToObjects(rows)[0];
}

async function getGameByTitle(title) {
    const { rows } = await pool.query(
        `
        SELECT * FROM games WHERE title = $1;
        `,
        [title]
    );

    return rows[0] || null;
}

async function getAllGames() {
    const { rows } = await pool.query(`
        SELECT g.*, ge.name genre, ge.id genre_id FROM games g LEFT JOIN
        game_genres gg ON g.id = gg.game_id LEFT JOIN 
        genres ge ON ge.id = gg.genre_id;
    `);

    return convertGameRowsToObjects(rows);
}

async function getAllGenres() {
    const { rows } = await pool.query("SELECT * FROM genres");
    return rows;
}

async function getAllGamesInGenre(genreId) {
    const { rows: gameIdRows } = await pool.query(
        `
        SELECT g.id 
        FROM game_genres gg 
        JOIN games g ON gg.game_id = g.id
        WHERE gg.genre_id = $1;
        `,
        [genreId]
    );

    const gameIds = gameIdRows.map((row) => row.id);

    if (gameIds.length === 0) return [];

    const { rows: games } = await pool.query(
        `
        SELECT g.*, ge.name genre, ge.id genre_id
        FROM game_genres gg 
        JOIN games g ON g.id = gg.game_id 
        JOIN genres ge ON ge.id = gg.genre_id
        WHERE g.id = ANY($1);
        `,
        [gameIds]
    );

    return convertGameRowsToObjects(games);
}

async function insertGame({
    title,
    genres = [],
    description,
    developer,
    year,
    price,
    imageUrl,
}) {
    const { rows } = await pool.query(
        `
        INSERT INTO games (title, description, developer, year, price, image_url)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
    `,
        [title, description, developer, year, price, imageUrl]
    );

    const gameId = rows[0].id;

    for (const genreId of genres) {
        const { rows: existingGenres } = await pool.query(
            `
            SELECT * FROM genres WHERE id = $1;
            `,
            [genreId]
        );

        if (existingGenres.length === 0) continue;

        await pool.query(
            `
            INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)
            `,
            [gameId, genreId]
        );
    }
}

async function getGenreById(genreId) {
    const { rows } = await pool.query(
        `
        SELECT * FROM genres WHERE id = $1;
        `,
        [genreId]
    );

    return rows[0] || null;
}

async function editGame(
    gameId,
    { title, genres = [], description, developer, year, price, imageUrl }
) {
    await pool.query(
        `
        UPDATE games
        SET title = $1,
            description = $2,
            developer = $3,
            year = $4,
            price = $5,
            image_url = $6
        WHERE id = $7
        `,
        [title, description, developer, year, price, imageUrl, gameId]
    );

    await pool.query(`DELETE FROM game_genres WHERE game_id = $1`, [gameId]);

    for (const genreId of genres) {
        const { rows: existingGenres } = await pool.query(
            `SELECT * FROM genres WHERE id = $1`,
            [genreId]
        );

        if (existingGenres.length === 0) continue;

        await pool.query(
            `INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)`,
            [gameId, genreId]
        );
    }
}

export default {
    getAllGames,
    getAllGenres,
    insertGame,
    getAllGamesInGenre,
    getGameByTitle,
    getGameById,
    getGenreById,
    editGame,
};
