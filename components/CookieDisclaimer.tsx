'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export function CookieDisclaimer() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('storyboarder-cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('storyboarder-cookie-consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 z-[100] sm:left-auto sm:right-6 sm:w-[400px]">
            <div className="relative overflow-hidden rounded-2xl border border-[#ec3750]/20 bg-white p-6 shadow-2xl backdrop-blur-xl dark:bg-zinc-900/90">
                {/* Decorative background element */}
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#ec3750]/5" />

                <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ec3750]/10 text-[#ec3750]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                                <path d="M8.5 8.5v.01" />
                                <path d="M16 15.5v.01" />
                                <path d="M12 12v.01" />
                                <path d="M11 17v.01" />
                                <path d="M7 14v.01" />
                            </svg>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                            Cookies Disclaimer
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                            We use cookies to ensure you get the best experience on Storyboarder. These cookies help us save your projects and preferences locally.
                        </p>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button
                            onClick={handleAccept}
                            className="flex-1 rounded-xl bg-[#ec3750] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#ec3750]/20 transition-all hover:bg-[#d12f45] hover:shadow-[#ec3750]/30 active:scale-95"
                        >
                            Accept Cookies
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
