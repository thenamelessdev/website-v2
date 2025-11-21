import express, { Request, Response } from "express";
const router = express.Router();
const demo = process.env.demo || "false"
import verify from "../verify.js";

router.get("/", (req: Request, res: Response) => {
    if (req.session.adminUname && req.session.adminUname == process.env.adminUname){
        res.render("admin/panel");
    }
    else{
        res.render("admin/index");
    }
});

router.post("/", async (req: Request, res: Response) => {
    const { username, password, } = req.body;
    const token = req.body["cf-turnstile-response"];

    if(username == process.env.adminUname && password == process.env.adminPassw){
        if(demo != "true"){
            if(await verify(token)) {
                req.session.adminUname = username;
                res.render("admin/panel");
            }
            else if(await !verify(token)){
                res.render("error", { error: "Cloudflare turnstile failed. Please try again." });
            }
            else{
                req.session.adminUname = username;
                res.render("admin/panel");
            }
        }
    }
    else {
        res.render("error", { error: "Wrong admin username or password" });
    }
});

router.get("/logout", (req: Request, res: Response) => {
    req.session.adminUname = undefined;
    res.redirect("/");
});

export default router;