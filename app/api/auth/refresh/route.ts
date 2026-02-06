// import { NextResponse } from "next/server";

// export async function POST() {
//     const res = await fetch("https://auth.hackclub.com/oauth/token", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             client_id: process.env.HACKCLUB_CLIENT_ID,
//             client_secret: process.env.HACKCLUB_CLIENT_SECRET,
//             refresh_token: storedRefreshToken,
//             grant_type: "refresh_token",
//         }),
//     });

//     return NextResponse.json(await res.json());
// }
