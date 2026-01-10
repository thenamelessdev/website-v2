import express, { Request, Response } from "express";
import { verify } from "../functions.js";
import { io } from "../index.js";
const router = express.Router();

interface typeWordRoom {
    name: string,
    host: string,
    player?: string,
    winner?: string,
}

export let typeWordRooms: Record<string, typeWordRoom> = {};

router.get("/", (req: Request, res: Response) => {
    res.render("projects/typeword/index")
});

router.post("/create", async (req: Request, res: Response) => {
    const { username, room } = req.body;

    if(username && room){
        if(await verify(req)){
            if(typeWordRooms[room]){
                res.render("error", { error: "Room name already exists" });
            }
            else{
                typeWordRooms[room] = {
                    name: room,
                    host: username
                }
                res.render("projects/typeword/game", { room: room, user: username, host: username, player: "none" });
            }
        }
        else{
            res.render("error", { error: "Cloudflare turnstile failed" });
        }
    }
    else{
        res.status(400).render("error", { error: "missing username or room name" });
    }
});

router.post("/join", async (req: Request, res: Response) => {
    const { username, room } = req.body;

    if(username && room){
        if(await verify(req)){
            if(typeWordRooms[room]){
                if(username != typeWordRooms[room].host){
                    if(!typeWordRooms[room].player){
                        typeWordRooms[room].player = username;
                        io.emit("typewordjoin", {"room": room, "username": username});
                        res.render("projects/typeword/game", { room: room, user: username, host: typeWordRooms[room].host, player: username });
                    }
                    else{
                        res.render("error", { error: "Player already joined this room" });
                    }
                }
                else{
                    res.render("error", { error: "Username cannot be the host's username" });
                }
            }
            else{
                res.status(404).render("error", { error: "Room doesn't exists" })
            }
        }
        else{
            res.render("error", { error: "Cloudflare turnstile failed" });
        }
    }
    else{
        res.status(400).render("error", { error: "missing username or room name" });
    }
});

export default router;