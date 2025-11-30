import queries from "../db/queries.js";

async function getAllGenres(req, res) {
    const genres = await queries.getAllGenres();
    res.render("genres", { genres })
}

async function getAllGamesInGenre(req, res) {
    const { genreId } = req.params;
    const games = await queries.getAllGamesInGenre(genreId);
    res.render("games", { games });
}

export default {
    getAllGenres,
    getAllGamesInGenre
}