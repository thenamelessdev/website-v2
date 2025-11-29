import express, { NextFunction, Request, Response, Router } from "express";
import { addKey, verifyKey, deleteKey, getClicks, getModAnnounce } from "../../../functions.js";
import { rooms } from "../../ttt.js";
const router = express.Router();

import adminRouter from "./admin.js";
router.use("/admin", adminRouter);

router.put("/keys", async (req:Request, res:Response) => {
    const username = req.session.username;
    if (username){
        const key = await addKey(username);
        if(await key){
            res.json({
                "key": key
            })
        }
        else{
            res.status(400).json({
                error: "User already has a key."
            });
        }
    }
    else{
        res.status(401).json({
            "error": "Login required"
        });
    }
});

router.delete("/keys", async (req: Request, res: Response) => {
    const username = req.session.username;

    if(username){
        const deleteApiKey = await deleteKey(username);
        if(await deleteApiKey){
            res.status(200).json({
                message: "API key deleted"
            });
        }
        else{
            res.status(400).json({
                error: "You don't have a API key"
            });
        }
    }
    else{
        res.sendStatus(401);
    }
});

router.get("/announcement", async (req: Request, res: Response) => {
    const announcement = await getModAnnounce();

    res.json({
        announcement: announcement
    });
});


router.use(async (req: Request, res: Response, next: NextFunction) => {
    const { auth } = req.headers;
    const demo = process.env.demo || "false";

    if (demo == "true"){
        next();
    }

    if (!auth){
        res.status(401).json({
            error: "missing auth header"
        });
    }

    if (await verifyKey(auth?.toString() ?? "")){
        next();
    }

    res.status(401).json({
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

router.use((req: Request, res: Response) => {
    res.status(404).json({
        error: "404 not found"
  });
});


export default router;