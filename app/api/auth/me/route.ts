import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");

    if (!token) {
        console.warn("No access_token cookie found in /api/auth/me");
        return NextResponse.json({ error: "invalid_auth" });
    }

    console.log("Fetching user from Hack Club with token...");
    // Ask Hack Club who this token belongs to
    const meRes = await fetch("https://auth.hackclub.com/api/v1/me", {
        headers: {
            Authorization: `Bearer ${token.value}`,
        },
    });

    if (!meRes.ok) {
        console.error("Failed to fetch user from Hack Club:", meRes.status);
        return NextResponse.json({ error: "hackclub_api_error" }, { status: meRes.status });
    }

    const data = await meRes.json();
    return NextResponse.json(data);
}
