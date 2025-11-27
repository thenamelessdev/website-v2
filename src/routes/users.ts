import express, { Request, Response, Router } from "express";
import { json } from "stream/consumers";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    const dcLink = process.env.dcLink || "/error/Discord login link not found. Please try again"
    const ghLink = process.env.githubLink || "/error/GitHub login link not found. Please try again";
    if(req.session.username){
        res.redirect("/users/dashboard");
    }
    else{
        res.render("users/login", { dc: dcLink, gh: ghLink });
    }
});

router.get("/callback/discord", async (req: Request, res: Response) => {
    const clientSecret = process.env.dcClientSecret || "im missing";
    const clientId = process.env.dcClientId || "im missing";
    const dcLink = process.env.dcRedirectUri || "/error/Discord login link not found. Please try again"
    const code = req.query.code as string;
    
    const exchangeCode = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            "client_id": clientId,
            "client_secret": clientSecret,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": dcLink
        })
    });
    const exchangeCodeJson = await exchangeCode.json();
    if(exchangeCode.ok){
        const accessToken = "Bearer " + exchangeCodeJson.access_token;
        const getUname = await fetch("https://discord.com/api/users/@me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": accessToken
            }
        })
        const getUnameJson = await getUname.json();
        if(getUname.ok){
            const username = getUnameJson.username;
            req.session.username = username;
            res.redirect("/users/dashboard");
        }
        else{
            res.render("error", { error: "There was an error while getting your username. Please try again" });
            console.log(getUnameJson);
        }
    }
    else{
        res.render("error", { error: "There was an error while getting your access token. Please try again" });
        console.log(exchangeCodeJson);
    }
});

router.get("/callback/github", async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const clientSecret =  process.env.githubClientSecret || "im missing";
    const clientId = process.env.githubClientId || "im missing";

    const exchangeCode = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code: code
        })
    });
    const exchangeCodeJson = await exchangeCode.json();
    if(exchangeCode.ok){
        const token = exchangeCodeJson.access_token;
        
        const getUsername = await fetch("https://api.github.com/user", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const getUsernameJson = await getUsername.json();

        if (exchangeCode.ok){
            const username = getUsernameJson.login;
            req.session.username = username;
            res.redirect("/users/dashboard");
        }
        else{
            res.render("error", { error: "There was an error while getting your username." })
        }
    }
    else{
        res.render("error", { error: "There was an error while exchanging the access token" });
    }
});


router.get("/logout", (req: Request, res: Response) => {
    req.session.username = undefined;
    res.redirect("/");
});

router.get("/dashboard", (req: Request, res: Response) => {
    if(req.session.username){
        res.render("users/dashboard", { username: req.session.username });
    }
    else{
        res.redirect("/users");
    }
});

router.get("/dashboard/api", (req: Request, res: Response) => {
    if (req.session.username){
        res.render("users/api");
    }
    else{
        res.redirect("/users");
    }
});


export default router;