import express, { Request, Response, Router } from "express";
import { io } from "../index.js";
const router = express.Router();

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
router.post("/rooms", (req: Request, res: Response) => {
    const { room, name } = req.body;
    if (rooms[room]){
        res.render("error", { error: "Room name already exists" });
    }
    else{
        rooms[room] = { name: room, host: name, turn: "X" };
        res.render("projects/ttt/game", { room: room, host: name, you: rooms[room].host, player: "none", role: "X" });
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


export default router;