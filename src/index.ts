//imports
import express, { Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import http from "http";

//vars and conf
dotenv.config();
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.set("view engine", "ejs");
const port = process.env.port || 8080;
app.use(session({
    secret: process.env.secret || "DO NOT USE ME",
    saveUninitialized: true,
    resave: false
}));

//rootdir
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootdir = path.join(__dirname, "..");

//routes
import projectsRouter from "./routes/projects.js";
app.use("/projects", projectsRouter);

//main things
app.get("/", (req: Request, res: Response) => {
    res.render("index");
});
app.get("/who", (req: Request, res: Response) => {
    res.render("who");
});
app.get("/style.css", (req: Request, res: Response) => {
    res.sendFile(rootdir + "/views/style.css");
});

//404 page
app.use((req: Request, res: Response) => {
    res.status(404).render("404");
})

server.listen({port, host: "0.0.0.0"});