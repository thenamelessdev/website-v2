import express, { Request, Response } from "express";
import { verify, verifyAdmin } from "../functions.js";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    if (req.session.adminUname){
        res.render("admin/panel", { name: req.session.adminUname });
    }
    else{
        res.render("admin/index");
    }
});

router.post("/", async (req: Request, res: Response) => {
    const { username, password, } = req.body;
    if (await verify(req)){
        if(await verifyAdmin(username, password)){
            req.session.adminUname = username;
            res.redirect("/admin");
        }
        else {
            res.render("error", { error: "Wrong admin username or password" });
        }
    }
    else{
        res.render("error", { error: "Cloudflare turnstile failed" })
    }
});

router.get("/logout", (req: Request, res: Response) => {
    req.session.adminUname = undefined;
    res.redirect("/");
});

export default router;