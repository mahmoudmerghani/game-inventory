import queries from "./queries.js";
import pool from "./pool.js";

await pool.query(`
    DELETE FROM game_genres;
`);
await pool.query(`
    DELETE FROM games;
`);
await pool.query(`
    DELETE FROM genres;
`);

const games = [
    {
        title: "Hollow Knight",
        genres: ["Metroidvania", "Action-Adventure"],
        description: "",
        developer: "Team Cherry",
        year: 2017,
        imageUrl: "",
    },
    {
        title: "Silksong",
        genres: ["Metroidvania", "Action-Adventure"],
        description: "",
        developer: "Team Cherry",
        year: 2025,
        imageUrl: "",
    },
    {
        title: "Elden Ring",
        genres: ["Action RPG", "Open World"],
        description: "",
        developer: "FromSoftware",
        year: 2022,
        imageUrl: "",
    },
    {
        title: "Celeste",
        genres: ["Platformer", "Indie"],
        description: "",
        developer: "Matt Makes Games",
        year: 2018,
        imageUrl: "",
    },
    {
        title: "Hades",
        genres: ["Roguelike", "Action RPG"],
        description: "",
        developer: "Supergiant Games",
        year: 2020,
        imageUrl: "",
    },
    {
        title: "GTA V",
        genres: ["Open World", "Action"],
        description: "",
        developer: "Rockstar Games",
        year: 2013,
        imageUrl: "",
    },
    {
        title: "Dark Souls",
        genres: ["Action RPG", "Dark Fantasy"],
        description: "",
        developer: "FromSoftware",
        year: 2011,
        imageUrl: "",
    },
    {
        title: "Sekiro: Shadows Die Twice",
        genres: ["Action RPG", "Stealth-Action"],
        description: "",
        developer: "FromSoftware",
        year: 2019,
        imageUrl: "",
    },
    {
        title: "The Witcher 3: Wild Hunt",
        genres: ["Action RPG", "Open World"],
        description: "",
        developer: "CD Projekt Red",
        year: 2015,
        imageUrl: "",
    },
    {
        title: "The Legend of Zelda: Ocarina of Time",
        genres: ["Action-Adventure", "RPG"],
        description: "",
        developer: "Nintendo",
        year: 1998,
        imageUrl: "",
    },
    {
        title: "Super Mario 64",
        genres: ["Platformer", "3D Platformer"],
        description: "",
        developer: "Nintendo",
        year: 1996,
        imageUrl: "",
    },
];

for (const game of games) {
    await queries.insertGame(game);
}
