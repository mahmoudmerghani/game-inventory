import express from "express";
import gamesController from "../controllers/gamesController.js";

const gamesRouter = express.Router();

gamesRouter.get("/", gamesController.getAllGames);

export default gamesRouter;