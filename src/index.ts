//imports
import express, { Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";
import { fileURLToPath } from "url";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { rooms } from "./routes/ttt.js";
import { readFileSync, writeFileSync } from "fs";
import { addClick, getClicks } from "./functions.js";

//vars and conf
dotenv.config();
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const port = process.env.port || 8080;
app.use(session({
    secret: process.env.secret || "DO NOT USE ME",
    saveUninitialized: true,
    resave: false,
    store: MongoStore.create({
        mongoUrl: process.env.connString,
        collectionName: "session"
    })
}));
export const io = new Server(server);
const demo = process.env.demo || "false"

if(demo == "true"){
    console.warn("WARNING: THIS IS DEMO MODE. SECURITY THINGS ARE DISABLED");
}

//rootdir
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootdir = path.join(__dirname, "..");

//routes
import projectsRouter from "./routes/projects.js";
app.use("/projects", projectsRouter);

import adminRoter from "./routes/admin.js";
app.use("/admin", adminRoter);

import usersRouter from "./routes/users.js";
app.use("/users", usersRouter);
import apiRouter from "./routes/api/v1/api.js";
app.use("/api/v1", apiRouter);

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
app.get("/logo", (req: Request, res: Response) => {
    res.sendFile(rootdir + "/assets/images/logo.png");
});

app.get("/error/:error", (req: Request, res: Response) => {
    const { error } = req.params;
    res.render("error", { error: error });
});

//404 page
app.use((req: Request, res: Response) => {
    res.status(404).render("404");
})


// websocket stuff
io.on("connection", async (socket) => {
    
    socket.emit("clicks", await getClicks());
    socket.on("click", async () => {
        await addClick();
        io.emit("clicks", await getClicks());
    });


    socket.on("resetReq", (data) => {
        const room = data.room;
        io.emit("reset", { room: room });
    });
    socket.on("delete", (data) => {
        const room = data.room;
        io.emit("delete", ({ room: room }));
        delete rooms[room];
    });
});

server.listen({port, host: "0.0.0.0"});