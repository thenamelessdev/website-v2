import express, { Request, Response, Router } from "express";
import { io } from "../index.js";
const router = express.Router();

interface Room {
    name: string;
    host: string;
    player?: string;
}

export let rooms: Record<string, Room> = {};

router.get("/", (req: Request, res: Response) => {
    res.render("projects/ttt/index");
});
router.post("/rooms", (req: Request, res: Response) => {
    const { room, name } = req.body;
    if (rooms[room]){
        res.render("error", { error: "Room name already exists" });
    }
    else{
        rooms[room] = { name: room, host: name };
        res.render("projects/ttt/game", { room: room, host: name, you: rooms[room].host, player: "none" });
    }

});

router.post("/join", (req: Request, res: Response) => {
    const { room, username } = req.body;

    if(rooms[room]){
        if(!rooms[room].player){
            if(rooms[room].host == username){
                res.render("error", { error: "Your username is the same as teh host's" })
            }
            else{
                rooms[room].player = username;
                res.render("projects/ttt/game", { room: room, host: rooms[room].host, you: username, player: username });
                io.emit("info", ({ room: room, username: username }));
            }
        }
        else{
            res.render("error", { error: "player aleady joined this lobby" });
        }
    }
    else{
        res.render("error", { error: "room doesn't exist" });
    }
});




export default router;