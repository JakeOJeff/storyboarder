'use client';
import { getUser } from "@/lib/auth";
import Image from "next/image";
import { LogIn } from 'lucide-react';

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

    const avatarSrc = user.avatar || "https://cloud-i58v96x56-hack-club-bot.vercel.app/0flag-orpheus-top.png";

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">{user.name}</span>

            <Image
                src={avatarSrc}
                alt="avatar"
                width={36}
                height={36}
                className="rounded-full border border-slate-200"
            />
        </div>
    );
}
