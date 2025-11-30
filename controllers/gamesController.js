import queries from "../db/queries.js";

async function getAllGames(req, res) {
    const games = await queries.getAllGames();
    res.render("games", { games });
}

async function getAddGameForm(req, res) {
    const genres = await queries.getAllGenres();
    res.render("addGame", { genres });
}

async function insertGame(req, res) {
    
    res.redirect("/games");
}

export default {
    getAllGames,
    getAddGameForm,
    insertGame,
};