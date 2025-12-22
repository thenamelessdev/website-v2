import express, { Request, Response } from "express";
const router = express.Router()
import { addKey, deleteKey, getModAnnounce } from "../../../functions.js";
import { error } from "console";

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

router.post("/request", async (req: Request, res: Response) => {
    const { method, url, body, headers } = req.body;
    let resBody;

    if(method && url){
        try{
            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: JSON.stringify(body)
            });
            const contenttype = await response.headers.get("content-type");
            if(contenttype?.includes("application/json")){
                resBody = await response.json()
            }
            else{
                resBody = await response.text();
            }
            res.json({
                status: await response.status,
                body: resBody
            });
        }
        catch{
            res.status(400).json({
                error: "There was an error while sending the request. Make sure that the url is well formatted"
            });
        }
    }
    else{
        res.status(400).json({
            error: "method and url are required in body"
        });
    }
});

export default router;