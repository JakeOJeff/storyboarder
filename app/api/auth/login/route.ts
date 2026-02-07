import { NextResponse } from "next/server";

export async function GET() {
    const url =
        "https://auth.hackclub.com/oauth/authorize" +
        "?client_id=" + process.env.HACKCLUB_CLIENT_ID +
        "&redirect_uri=" + process.env.HACKCLUB_REDIRECT_URI +
        "&response_type=code" +
        "&scope=openid%20profile%20email%20name";

    console.log("AUTH URL:", url);

    return NextResponse.redirect(url);
}
