'use client';

import { LogIn } from 'lucide-react';

export function SignInButton() {
    return (
        <button
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#ec3750] shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-default"
        >
            <LogIn className="h-4 w-4" />
            Sign in with Hack Club
        </button>
    );
}
