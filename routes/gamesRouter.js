import express from "express";
import gamesController from "../controllers/gamesController.js";

const gamesRouter = express.Router();

gamesRouter.use(express.urlencoded({ extended: true }));

gamesRouter.get("/", gamesController.getAllGames);
gamesRouter.get("/add", gamesController.getAddGameForm);
gamesRouter.post("/", gamesController.insertGame);

export default gamesRouter;