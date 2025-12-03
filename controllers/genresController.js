import { body, validationResult, matchedData } from "express-validator";
import queries from "../db/queries.js";

const validateGenre = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Genre name must not be empty")
        .custom(async (value) => {
            const genre = await queries.getGenreByName(value);

            if (genre) {
                throw new Error("A genre already exists with the same name");
            }
        }),
];

async function getAllGenres(req, res) {
    const genres = await queries.getAllGenres();
    const genreAdded = req.query.genreAdded === "true";
    const genreDeleted = req.query.genreDeleted === "true";
    res.render("genres", { genres, genreAdded, genreDeleted });
}

async function getAllGamesInGenre(req, res) {
    const { genreId } = req.params;
    const games = await queries.getAllGamesInGenre(genreId);
    const selectedGenre = await queries.getGenreById(genreId);
    res.render("games", { games, selectedGenre });
}

function getAddGenreForm(req, res) {
    res.render("genreForm", { type: "add" });
}

const addGenre = [
    validateGenre,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("genreForm", {
                errors: errors.array(),
                formData: req.body,
                type: "add",
            });
        }

        await queries.addGenre(matchedData(req));
        res.redirect("/genres?genreAdded=true");
    },
];

const deleteGenre = [
    body("password")
    .equals(process.env.SECRET)
    .withMessage("Wrong password"),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("passwordForm", {
                action: req.originalUrl,
                errors: errors.array(),
            });
        }
        
        const { genreId } = req.params;
        await queries.deleteGenre(genreId);

        res.redirect("/genres?genreDeleted=true");
    },
];

function getDeleteGenreForm(req, res) {
    const { genreId } = req.params;
    res.render("passwordForm", { action: `/genres/${genreId}/delete` });
}

export default {
    getAllGenres,
    getAllGamesInGenre,
    addGenre,
    getAddGenreForm,
    deleteGenre,
    getDeleteGenreForm,
};
