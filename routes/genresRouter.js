import express from "express";
import genresController from "../controllers/genresController.js";

const genresRouter = express.Router();

genresRouter.use(express.urlencoded({ extended: true }));

genresRouter.get("/", genresController.getAllGenres);
genresRouter.get("/add", genresController.getAddGenreForm);
genresRouter.post("/add", genresController.addGenre);
genresRouter.post("/:genreId/delete", genresController.deleteGenre);
genresRouter.get("/:genreId", genresController.getAllGamesInGenre);


export default genresRouter;