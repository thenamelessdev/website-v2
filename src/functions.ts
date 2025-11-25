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
        return false;
    }
    else{
        return false;
    }
}

export async function addKey(username:string){
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const rootdir = join(__dirname, "..");
    const keys = join(rootdir, "keys.json");

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
    const keys = join(rootdir, "keys.json");

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
    const keys = join(rootdir, "keys.json");

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