import express, { Request, Response, Router, NextFunction } from "express";
import { updateAnnouncement } from "../../../functions.js";
const router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    if(req.session.adminUname == process.env.adminUname || process.env.demo == "true"){
        next();
    }
    else{
        res.status(401).json({
            error: "missing/invalid admin username"
        });
    }
});

router.patch("/announcement", async (req: Request, res: Response) => {
    const { announcement } = req.body;

    await updateAnnouncement(announcement);
    res.sendStatus(204);
});

router.use((req: Request, res: Response) => {
    res.status(404).json({
        error: "not found"
    });
});

export default router;