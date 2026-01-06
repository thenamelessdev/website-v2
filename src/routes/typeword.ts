import express, { Request, Response } from "express";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.render("projects/typeword/index")
});

router.post("/create", (req: Request, res: Response) => {
    const { username, room } = req.body;

    if(username && room){
        
    }
    else{
        res.status(400).render("error", { error: "missing username or room name" });
    }
});

export default router;