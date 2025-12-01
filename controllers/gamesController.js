import queries from "../db/queries.js";
import { body, matchedData, validationResult } from "express-validator";

const validateGame = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 1, max: 200 })
        .withMessage("Title must be between 1 and 200 characters")
        .custom(async (value) => {
            const game = await queries.getGameByTitle(value);

            if (game) {
                throw new Error("A game already exists with the same title");
            }
        }),

    body("developer")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("Developer must be between 1 and 100 characters"),

    body("year")
        .optional({ values: "falsy" })
        .isInt({ min: 1980 })
        .withMessage(`Year must be after 1980 }`)
        .toInt(),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number")
        .toFloat(),

    body("imageUrl")
        .optional({ values: "falsy" })
        .isURL()
        .withMessage("Image must be a valid URL"),

    body("genres").optional().toArray(),

    body("description")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description must not exceed 1000 characters"),
];

async function getAllGames(req, res) {
    const games = await queries.getAllGames();
    const gameAdded = req.query.gameAdded === "true";
    res.render("games", { games, gameAdded });
}

async function getAddGameForm(req, res) {
    const genres = await queries.getAllGenres();
    res.render("addGame", { genres });
}

const insertGame = [
    validateGame,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const genres = await queries.getAllGenres();
            return res.render("addGame", {
                genres,
                errors: errors.array(),
                formData: req.body,
            });
        }

        await queries.insertGame(matchedData(req));
        res.redirect("/games?gameAdded=true");
    },
];

export default {
    getAllGames,
    getAddGameForm,
    insertGame,
};
