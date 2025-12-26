import express, { Request, Response } from "express";
const router = express.Router()
import { addKey, deleteKey, getModAnnounce } from "../../../functions.js";

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
            let safeHeaders: Record<string, string> = {};
            if (headers && typeof headers === "object" && !Array.isArray(headers)) {
                for (const [key, value] of Object.entries(headers)) {
                    if (
                        typeof key === "string" &&
                        typeof value !== "undefined" &&
                        value !== null
                    ) {
                        safeHeaders[key] = String(value);
                    }
                }
            }

            const response = await fetch(url, {
                method: method,
                headers: safeHeaders,
                body: method == "GET" ? undefined : JSON.stringify(body)
            });
            const contenttype = await response.headers.get("content-type");
            if(contenttype?.includes("application/json")){
                resBody = await response.json()
            }
            else{
                resBody = await response.text();
            }
            res.json({
                status: response.status,
                body: resBody,
                headers: Object.fromEntries(response.headers.entries())
            });
        }
        catch (error){
            res.status(400).json({
                error: "There was an error while sending the request. Make sure that the url is well formatted"
            });
            console.error(error);
        }
    }
    else{
        res.status(400).json({
            error: "method and url are required in body"
        });
    }
});

export default router;