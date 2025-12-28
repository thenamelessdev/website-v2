import express, { Request, Response, Router } from "express";
const router = express.Router();

import tttRouter from "./ttt.js";
router.use("/ttt", tttRouter);

router.get("/", (req: Request, res: Response) => {
    res.render("projects");
});
router.get("/:project", (req: Request, res: Response) => {
    const { project } = req.params;

    if(project == "age"){
        res.render("projects/age guesser");
    }
    else if(project == "calculator"){
        res.render("projects/calc");
    }
    else if(project == "timer") {
        res.render("projects/timer");
    }
    else if(project == "cookie"){
        res.render("projects/cookie");
    }
    else if(project == "refresher") {
        if(req.session){
            if(req.session.views) {
                req.session.views++;
                res.render("projects/refresher", { visits: req.session.views });
            }
            else{
                req.session.views = 1;
                res.render("projects/refresher", { visits: req.session.views });
            }
        }
    }
    else if(project == "suggestion"){
        res.render("projects/suggestions");
    }
    else if(project == "webhook"){
        res.render("projects/dcWebhook");
    }
    else if(project == "request"){
        res.render("projects/request", { url: req.query.url ? req.query.url : "", method: req.query.method ? req.query.method : "GET" }); 
    }
    else if(project == "base64"){
        res.render("projects/base64");
    }
    else if(project == "crasher"){
        res.render("projects/crasher");
    }
    else {
        res.render("404");
    }
});

export default router;