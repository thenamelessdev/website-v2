import express, { Request, Response, Router } from "express";
import { io } from "../index.js";
const router = express.Router();
import { verify } from "../functions.js";

interface Room {
    name: string;
    host: string;
    player?: string;
    turn: string;
}

/*
    A table looks like this:
    A1 A2 A3
    B1 B2 B3
    C1 C2 C3

    for example the middle is B2
 */


export let rooms: Record<string, Room> = {};

router.get("/", (req: Request, res: Response) => {
    res.render("projects/ttt/index");
});
router.post("/rooms", async (req: Request, res: Response) => {
    const { room, name } = req.body;
    if(await verify(req)) {
        if (rooms[room]){
            res.render("error", { error: "Room name already exists" });
        }
        else{
            rooms[room] = { name: room, host: name, turn: "X" };
            res.render("projects/ttt/game", { room: room, host: name, you: rooms[room].host, player: "none", role: "X" });
        }
    }
    else{
        res.render("error", { error: "Cloudflare turnstile failed. Please try again" });
    }

});

router.post("/join", async (req: Request, res: Response) => {
    const { room, username } = req.body;
    if(await verify(req)){
        if(rooms[room]){
            if(!rooms[room].player){
                if(rooms[room].host == username){
                    res.render("error", { error: "Your username is the same as the host's" })
                }
                else{
                    rooms[room].player = username;
                    res.render("projects/ttt/game", { room: room, host: rooms[room].host, you: username, player: username, role: "O" });
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
    }
    else{
        res.render("error", { error: "Cloudflare turnstile failed. Please try again" });
    }
});

router.get("/invite/:code", (req: Request, res: Response) => {
    const { code } = req.params;

    res.render("projects/ttt/invite", { code: code });
});

router.post("/move", (req: Request, res: Response) => {
    const { room, player, move } = req.body;
    const turn = rooms[room].turn;
    if(turn == "X"){
        rooms[room].turn = "O"
    }
    else{
        rooms[room].turn = "X"
    }
    io.emit("move", ({ room: room, move: move, player: player, turn: rooms[room].turn }));
    res.status(204).send();
});

router.post("/turn", (req: Request, res: Response) => {
    const { room } = req.body;
    res.status(204).send();
    io.emit("turn", ({ room: room, turn: rooms[room].turn }));
});

export default router;