import express, { Request, Response, Router } from "express";
const router = express.Router();

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
    else {
        res.render("404");
    }
});

export default router;