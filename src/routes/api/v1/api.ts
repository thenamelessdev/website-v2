import express, { Request, Response, Router } from "express";
import { addKey, verifyKey } from "../../../functions.js";
const router = express.Router();

router.put("/create", async (req:Request, res:Response) => {
    const username = req.session.username;
    if (username){
        const key = await addKey(username);
        if(await key){
            res.json({
                "key": key
            })
        }
        else{
            res.status(500).json({
                "error": "Couldn't add key to database."
            });
        }
    }
    else{
        res.status(401).json({
            "error": "Login required"
        });
    }
});

router.get("/verify", async (req:Request, res: Response) => {
    const { auth } = req.headers;

    if (auth){
        if(await verifyKey(auth.toString())){
            res.sendStatus(204);
        }
        else{
            res.status(401).json({
                "error": "Invalid API key"
            });
        }
    }
    else{
        res.status(401).json({
            "error": "missing auth header"
        });
    }
});

export default router;