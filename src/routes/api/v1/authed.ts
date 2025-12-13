import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
import { getClicks, verifyKey } from "../../../functions.js";
import { rooms } from "../../ttt.js";

router.use(async (req: Request, res: Response, next: NextFunction) => {
    const { auth } = req.headers;
    const demo = process.env.demo || "false";

    if (demo == "true" || req.session.adminUname || req.session.username){
        return next();
    }

    if (!auth){
        return res.status(401).json({
            error: "missing auth header"
        });
    }

    if (await verifyKey(auth?.toString() ?? "")){
        return next();
    }

    return res.status(401).json({
        error: "invalid API key"
    });
});

router.get("/verify", async (req:Request, res: Response) => {
    res.sendStatus(204);
});

router.get("/clicks", async (req: Request, res: Response) => {
    const clicks = await getClicks();
    res.json({
        clicks: clicks
    });
});

router.get("/rooms", (req: Request, res: Response) => {
    const { room } = req.query;

    if(room){
        if(rooms[room.toString()]){
            const requestedRoom = rooms[room.toString()];
            res.json({
                room: {
                    name: requestedRoom.name,
                    host: requestedRoom.host,
                    player: requestedRoom.player || "no player joined"
                }
            });
        }
        else{
            res.status(404).json({
                error: "room not found"
            });
        }
    }
    else{
        res.status(400).json({
            "error": "missing room name"
        });
    }
});

export default router;