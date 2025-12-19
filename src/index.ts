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
import * as discojs from "@thenamelessdev/discojs";

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
const token = process.env.botToken || "im missing";
const logChannel = process.env.logChannel || "im missing";
discojs.config(token, logChannel);

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
app.get("/meow", (req: Request, res: Response) => {
    res.json({
        head: {
            title: "Thenamelessdev.com",
            description: "The page for the meow protocol of thenamelessdev.com"
        },
        body: {
            content: "Meow"
        }
    });
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

app.get("/privacy", (req: Request, res: Response) => {
    res.sendFile(rootdir + "/assets/legal/privacy policy.pdf");
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

let clicksMsg:any;
const clicksChannel = process.env.clicksChannel || "im missing";
setInterval(async () => {
    if(clicksMsg){
        await discojs.deleteMessage(clicksMsg.id, clicksMsg.channel_id);
        clicksMsg = await discojs.sendMessage(clicksMsg.channel_id, undefined, [{title: "Clicks", description: await getClicks()}]);
    }
    else{
        clicksMsg = await discojs.sendMessage(clicksMsg.channel_id, undefined, [{title: "Clicks", description: await getClicks()}]);
    }
}, 60000);

server.listen({port, host: "0.0.0.0"});