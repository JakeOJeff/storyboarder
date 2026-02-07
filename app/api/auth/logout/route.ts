import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();

    // Create response that redirects to home
    const response = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));

    // Clear the auth cookies
    response.cookies.delete("access_token");
    response.cookies.delete("user");

    return response;
}
