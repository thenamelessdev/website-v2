import express, { NextFunction, Request, Response, Router } from "express";
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

router.use(async (req: Request, res: Response, next: NextFunction) => {
    const { auth } = req.headers;
    if (auth){
        if (await verifyKey(auth.toString())){
            next();
        }
    }
    else{
        res.status(401).json({
            "error": "missing auth header"
        });
    }
});

router.get("/verify", async (req:Request, res: Response) => {
    res.sendStatus(204);
});

router.use((req: Request, res: Response) => {
    res.status(404).json({
        error: "404 not found"
  });
});


export default router;