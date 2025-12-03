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

const genres = [
    "Metroidvania",
    "Action-Adventure",
    "Action RPG",
    "Open World",
    "Platformer",
    "Indie",
    "Roguelike",
    "Dark Fantasy",
    "Stealth-Action",
    "RPG",
    "3D Platformer"
];

const games = [
    {
        title: "Hollow Knight",
        genres: ["Metroidvania", "Action-Adventure"],
        description:
            "A challenging hand-drawn Metroidvania with deep exploration, tight combat, and a hauntingly beautiful world.",
        developer: "Team Cherry",
        year: 2017,
        imageUrl: "/images/games/hollow_knight.jpg",
        price: 14.99,
    },
    {
        title: "Silksong",
        genres: ["Metroidvania", "Action-Adventure"],
        description:
            "The highly anticipated follow-up to Hollow Knight featuring a new protagonist, fresh abilities, and expansive new regions to explore.",
        developer: "Team Cherry",
        year: 2025,
        imageUrl: "/images/games/silksong.jpg",
        price: 29.99,
    },
    {
        title: "Elden Ring",
        genres: ["Action RPG", "Open World"],
        description:
            "A vast, atmospheric action RPG from FromSoftware that blends punishing combat with deep lore and open-world exploration.",
        developer: "FromSoftware",
        year: 2022,
        imageUrl: "/images/games/elden_ring.jpg",
        price: 59.99,
    },
    {
        title: "Celeste",
        genres: ["Platformer", "Indie"],
        description:
            "A tight, emotionally driven precision platformer about climbing a mountain while confronting personal challenges.",
        developer: "Matt Makes Games",
        year: 2018,
        imageUrl: "/images/games/celeste.jpg",
        price: 19.99,
    },
    {
        title: "Hades",
        genres: ["Roguelike", "Action RPG"],
        description:
            "A roguelike dungeon crawler with fast-paced combat, rich storytelling, and rewarding progression through repeated runs.",
        developer: "Supergiant Games",
        year: 2020,
        imageUrl: "/images/games/hades.jpg",
        price: 24.99,
    },
    {
        title: "Dark Souls",
        genres: ["Action RPG", "Dark Fantasy"],
        description:
            "A notoriously challenging action RPG known for its intricate level design, deep lore, and rewarding combat.",
        developer: "FromSoftware",
        year: 2011,
        imageUrl: "/images/games/dark_souls.jpg",
        price: 19.99,
    },
    {
        title: "Sekiro: Shadows Die Twice",
        genres: ["Action RPG", "Stealth-Action"],
        description:
            "A tense, skill-based action game focused on precision parry and posture combat set in a reimagined Sengoku-era Japan.",
        developer: "FromSoftware",
        year: 2019,
        imageUrl: "/images/games/sekiro.jpg",
        price: 49.99,
    },
    {
        title: "The Legend of Zelda: Ocarina of Time",
        genres: ["Action-Adventure", "RPG"],
        description:
            "A genre-defining action-adventure classic featuring memorable dungeons, an epic story, and timeless gameplay.",
        developer: "Nintendo",
        year: 1998,
        imageUrl: "/images/games/oot.jpg",
        price: 24.99,
    },
    {
        title: "Super Mario 64",
        genres: ["Platformer", "3D Platformer"],
        description:
            "A landmark 3D platformer that set the standard for the genre with creative level design and tight controls.",
        developer: "Nintendo",
        year: 1996,
        imageUrl: "/images/games/sm64.jpg",
        price: 19.99,
    },
];

const genreNameIdMap = {};

for (const name of genres) {
    const genreId = await queries.addGenre({ name });
    genreNameIdMap[name] = genreId;
}

// convert the genres names array to ids
for (const game of games) {
    game.genres = game.genres.map((genre) => genreNameIdMap[genre]);
}

for (const game of games) {
    await queries.insertGame(game);
}