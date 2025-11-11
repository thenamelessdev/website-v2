import { error } from "console";
import express, { Request, Response, urlencoded } from "express";
const router = express.Router();
const secret = process.env.CfSecret || "im missing";

async function verify(token: string) {
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
    });
    const result = await verify.json();
    if(result.success) {
        return true;
    }
    else{
        return false
    }
}

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
        if(await verify(token)) {
            req.session.adminUname = username;
            res.render("admin/panel");
        }
        else{
            res.render("error", { error: "Cloudflare turnstile failed. Please try again." });
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