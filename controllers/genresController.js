import queries from "../db/queries.js";

async function getAllGenres(req, res) {
    const genres = await queries.getAllGenres();
    res.render("genres", { genres })
}

async function getAllGamesInGenre(req, res) {
    const { genreId } = req.params;
    const games = await queries.getAllGamesInGenre(genreId);
    const selectedGenre = await queries.getGenreById(genreId);
    res.render("games", { games, selectedGenre });
}

export default {
    getAllGenres,
    getAllGamesInGenre
}