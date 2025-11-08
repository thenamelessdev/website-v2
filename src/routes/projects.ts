import express, { Request, Response, Router } from "express";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.render("projects");
});
router.get("/:project", (req: Request, res: Response) => {
    const { project } = req.params;

    if(project == "age"){
        res.render("age guesser");
    }
    if(project == "calculator"){
        res.render("projects/calc");
    }
    else {
        res.render("404");
    }
});

export default router;