import queries from "../db/queries.js";
import { body, matchedData, validationResult } from "express-validator";

const validateGame = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 1, max: 200 })
        .withMessage("Title must be between 1 and 200 characters"),

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
    const gameEdited = req.query.gameEdited === "true";
    const gameDeleted = req.query.gameDeleted === "true";
    res.render("games", { games, gameAdded, gameEdited, gameDeleted });
}

async function getAddGameForm(req, res) {
    const genres = await queries.getAllGenres();
    res.render("gameForm", { genres, type: "add" });
}

async function getEditGameForm(req, res) {
    const { gameId } = req.params;
    const game = await queries.getGameById(gameId);
    const genres = await queries.getAllGenres();

    if (!game) {
        throw new Error("Game does not exist");
    }

    res.render("gameForm", {
        formData: game,
        genres,
        type: "edit",
    });
}

const insertGame = [
    validateGame,
    body("title").custom(async (value) => {
        const game = await queries.getGameByTitle(value);

        if (game) {
            throw new Error("A game already exists with the same title");
        }
    }),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const genres = await queries.getAllGenres();
            return res.render("gameForm", {
                genres,
                errors: errors.array(),
                formData: req.body,
                type: "add",
            });
        }

        await queries.insertGame(matchedData(req));
        res.redirect("/games?gameAdded=true");
    },
];

const editGame = [
    validateGame,
    body("password")
    .equals(process.env.SECRET)
    .withMessage("Wrong password"),
    
    body("title").custom(async (value, { req }) => {
        const game = await queries.getGameByTitle(value);

        if (game && game.id !== parseInt(req.params.gameId)) {
            throw new Error("A game already exists with the same title");
        }
    }),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const genres = await queries.getAllGenres();
            return res.render("gameForm", {
                genres,
                errors: errors.array(),
                formData: {...req.body, id: req.params.gameId},
                type: "edit",
            });
        }

        const { gameId } = req.params;

        await queries.editGame(gameId, matchedData(req));
        res.redirect("/games?gameEdited=true");
    },
];

const deleteGame = [
    body("password").equals(process.env.SECRET).withMessage("Wrong password"),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("passwordForm", {
                action: req.originalUrl,
                errors: errors.array(),
            });
        }

        const { gameId } = req.params;
        await queries.deleteGame(gameId);

        res.redirect("/games?gameDeleted=true");
    },
];

function getDeleteGameForm(req, res) {
    const { gameId } = req.params;
    res.render("passwordForm", { action: `/games/${gameId}/delete` });
}

export default {
    getAllGames,
    getAddGameForm,
    getEditGameForm,
    editGame,
    insertGame,
    deleteGame,
    getDeleteGameForm,
};
