import express, { Request, Response } from "express";
import { verify } from "../functions.js";
const router = express.Router();

interface typeWordRoom {
    name: string,
    host: string,
    player?: string,
    winner?: string,
}

let rooms: Record<string, typeWordRoom> = {};

router.get("/", (req: Request, res: Response) => {
    res.render("projects/typeword/index")
});

router.post("/create", async (req: Request, res: Response) => {
    const { username, room } = req.body;

    if(username && room){
        if(await verify(req)){

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