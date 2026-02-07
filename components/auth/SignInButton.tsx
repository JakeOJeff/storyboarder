'use client';
import { getUser } from "@/lib/auth";
import Image from "next/image";
import { LogIn, LogOut } from 'lucide-react';

import { useUser } from "@/hooks/useUser";

export function SignInButton() {
    const { user, loading } = useUser();
    if (loading) return <div>...</div>;

    if (!user) {
        return (
            <a href="/api/auth/login">
                <button
                    className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#ec3750] shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-default"
                >
                    <LogIn className="h-4 w-4" />
                    Sign in with Hack Club
                </button>
            </a>
        );
    }

    const identity = user.identity || {};
    const fullName = [identity.first_name, identity.last_name].filter(Boolean).join(' ');
    const emailPrefix = identity.primary_email?.split('@')[0];
    const displayName = fullName || user.username || user.nickname || user.name || emailPrefix || "User";

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                {displayName}
            </span>
            <a href="/api/auth/logout">
                <button
                    className="flex items-center gap-2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors border border-white/20"
                    title="Sign Out"
                >
                    <LogOut className="h-4 w-4" />
                </button>
            </a>
        </div>
    );
}
