import { readFileSync, writeFileSync } from "fs";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";

export async function verify(request: any) {
    const token = request.body["cf-turnstile-response"];
    const secret = process.env.CfSecret || "im missing";
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
    });
    const result = await verify.json();
    if(result.success || process.env.demo == "true") {
        return true;
    }
    else if(!result.success){
        console.log(result);
        return false;
    }
    else{
        console.log(result);
        return false;
    }
}

export async function addKey(username:string){
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const rootdir = join(__dirname, "..");
    const keys = join(rootdir, "db.json");

    const raw = await readFileSync(keys);
    let json = await JSON.parse(raw.toString());
    const encodedUname = btoa(username);

    const existingKey = json.keys.find((k:string) => k.startsWith(encodedUname));
    if(existingKey){
        return false;
    }
    else{
        const key = Math.floor(Math.random() * Math.random() * 581729) * 62399
        const storeThis = `${encodedUname}.${key}`;
        json.keys.push(storeThis);
        await writeFileSync(keys, JSON.stringify(json));
        return storeThis;
    }
}

export async function verifyKey(key:string){
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const rootdir = join(__dirname, "..");
    const keys = join(rootdir, "db.json");

    const raw = await readFileSync(keys);
    let json = await JSON.parse(raw.toString());

    if(json.keys.includes(key)){
        return true;
    }
    else{
        return false;
    }
}

export async function deleteKey(username:string) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const rootdir = join(__dirname, "..");
    const keys = join(rootdir, "db.json");

    const raw = await readFileSync(keys);
    let json = await JSON.parse(raw.toString());

    const key = json.keys.find((k:string) => k.startsWith(btoa(username) + "."));

    if(key){
        json.keys = json.keys.filter((k: string) => k !== key)
        await writeFileSync(keys, JSON.stringify(json));
        return true;
    }
    else{
        return false;
    }
}

export async function addClick() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const rootdir = join(__dirname, "..");
    const db = join(rootdir, "db.json");

    const raw = await readFileSync(db);
    let json = await JSON.parse(raw.toString());

    if (json.clicks){
        json.clicks++;
        await writeFileSync(db, JSON.stringify(json));
        return true;
    }
    else{
        json.clicks = 1;
        await writeFileSync(db, JSON.stringify(json));
        return true;
    }
}

export async function getClicks() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const rootdir = join(__dirname, "..");
    const db = join(rootdir, "db.json");

    const raw = await readFileSync(db);
    let json = await JSON.parse(raw.toString());

    if (json.clicks){
        return json.clicks;
    }
    else{
        json.clicks = 0;
        await writeFileSync(db, JSON.stringify(json));
        return json.clicks;
    }
}

export async function getModAnnounce() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const rootdir = join(__dirname, "..");
    const db = join(rootdir, "db.json");

    const raw = await readFileSync(db);
    let json = await JSON.parse(raw.toString());

    if(json.announcement){
        return json.announcement;
    }
    else{
        json.announcement = "";
        await writeFileSync(db, JSON.stringify(json));
        return json.announcement;
    }
}

export async function updateAnnouncement(announcement:string) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const rootdir = join(__dirname, "..");
    const db = join(rootdir, "db.json");

    const raw = await readFileSync(db);
    let json = await JSON.parse(raw.toString());

    json.announcement = announcement;
    await writeFileSync(db, JSON.stringify(json));
    return true;
}