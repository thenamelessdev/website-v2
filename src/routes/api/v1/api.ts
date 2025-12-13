import express, { NextFunction, Request, Response, Router } from "express";
import { addKey, verifyKey, deleteKey, getClicks, getModAnnounce } from "../../../functions.js";
import { rooms } from "../../ttt.js";
const router = express.Router();

import adminRouter from "./admin.js";
router.use("/admin", adminRouter);
import unauthedRouter from "./unauthed.js";
router.use(unauthedRouter);
import authedRouter from "./authed.js";
router.use(authedRouter);

router.use((req: Request, res: Response) => {
    res.status(404).json({
        error: "404 not found"
  });
});


export default router;