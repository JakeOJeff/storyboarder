import { NextRequest, NextResponse } from "next/server";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

export async function GET(req: NextRequest) {
    const code = new URL(req.url).searchParams.get("code");

    if (!code) {
        return NextResponse.json({ error: "no_code" });
    }

    // 1. Exchange code for tokens
    console.log("Exchanging code for token...");
    const params = new URLSearchParams();
    params.set("client_id", process.env.HACKCLUB_CLIENT_ID!);
    params.set("client_secret", process.env.HACKCLUB_CLIENT_SECRET!);
    params.set("redirect_uri", process.env.HACKCLUB_REDIRECT_URI!);
    params.set("code", code);
    params.set("grant_type", "authorization_code");

    const tokenRes = await fetch("https://auth.hackclub.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
    });

    if (!tokenRes.ok) {
        const errorText = await tokenRes.text();
        console.error("Token exchange failed:", errorText);
        return NextResponse.json({ error: "token_exchange_failed", details: errorText }, { status: 500 });
    }

    const tokens = await tokenRes.json();
    console.log("Tokens received:", tokens.access_token ? "Success" : "Failed");

    if (!tokens.access_token) {
        return NextResponse.json({ error: "no_access_token_in_response" }, { status: 500 });
    }

    // 2. Fetch user using token
    console.log("Fetching user profile...");
    const meRes = await fetch("https://auth.hackclub.com/api/v1/me", {
        headers: {
            Authorization: `Bearer ${tokens.access_token}`,
        },
    });

    if (!meRes.ok) {
        const errorText = await meRes.text();
        console.error("Failed to fetch user profile:", errorText);
        return NextResponse.json({ error: "user_fetch_failed", details: errorText }, { status: 500 });
    }

    const user = await meRes.json();
    console.log("User fetched:", user.name);

    // 3. SAVE BOTH TOKEN + USER
    const res = NextResponse.redirect(new URL("/", req.url));

    res.cookies.set("access_token", tokens.access_token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    res.cookies.set("user", JSON.stringify(user), {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
}

