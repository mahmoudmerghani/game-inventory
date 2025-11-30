import queries from "../db/queries.js";

async function getAllGames(req, res) {
    const games = await queries.getAllGames();
    console.log(games);
    res.render("games", { games });
}

export default {
    getAllGames,
};