import pool from "./pool.js";

await pool.query(`
CREATE TABLE IF NOT EXISTS games (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL UNIQUE,
  description TEXT,
  developer TEXT,
  year INTEGER,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT
);
`);

await pool.query(`
CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE
);
`);

await pool.query(`
CREATE TABLE IF NOT EXISTS game_genres (
  game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, genre_id)
);
`);
