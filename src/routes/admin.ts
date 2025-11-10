import express, { Request, Response } from "express";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    if (req.session.adminUname && req.session.adminUname == process.env.adminUname){
        res.render("admin/panel");
    }
    else{
        res.render("admin/index");
    }
});

router.post("/", (req: Request, res: Response) => {
    const { username, password } = req.body;

    if(username == process.env.adminUname && password == process.env.adminPassw){
        req.session.adminUname = username;
        res.render("admin/panel");
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