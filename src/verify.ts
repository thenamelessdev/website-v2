export default async function verify(token: string) {
    const secret = process.env.CfSecret || "im missing";
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
    });
    const result = await verify.json();
    if(result.success) {
        return true;
    }
    else if(!result.success){
        return false;
    }
    else{
        return false;
    }
}