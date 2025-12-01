import pool from "./pool.js";

// convert genres to an array instead of duplicate game rows
function normalizeGameObjects(gameRows) {
    const games = {};

    for (const row of gameRows) {
        if (games[row.id]) {
            games[row.id].genre.push(row.genre);
        } else {
            games[row.id] = { ...row, genre: [row.genre] };
        }
    }

    return Object.values(games);
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
        SELECT g.*, ge.name genre FROM game_genres gg JOIN
        games g ON g.id = gg.game_id JOIN 
        genres ge ON ge.id = gg.genre_id;
    `);

    return normalizeGameObjects(rows);
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
        SELECT 
            g.*, 
            ge.name AS genre
        FROM game_genres gg 
        JOIN games g ON g.id = gg.game_id 
        JOIN genres ge ON ge.id = gg.genre_id
        WHERE g.id = ANY($1);
        `,
        [gameIds]
    );

    return normalizeGameObjects(games);
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

export default {
    getAllGames,
    getAllGenres,
    insertGame,
    getAllGamesInGenre,
    getGameByTitle,
};
