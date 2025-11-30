import express from "express";
import genresController from "../controllers/genresController.js";

const genresRouter = express.Router();

genresRouter.get("/", genresController.getAllGenres);
genresRouter.get("/:genreId", genresController.getAllGamesInGenre);


export default genresRouter;