import express from "express"
import { join } from "node:path";
import gamesRouter from "./routes/gamesRouter.js";
import genresRouter from "./routes/genresRouter.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", join(import.meta.dirname, "views"));

app.use(express.static(join(import.meta.dirname, "public")));

app.get("/", (req, res) => {
    res.render("index");
});

app.use("/games", gamesRouter);

app.use("/genres", genresRouter);

app.listen(8080);