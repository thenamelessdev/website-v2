//imports
import express, { Request, Response } from "express";
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

server.listen({port, host: "0.0.0.0"});