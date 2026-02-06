"use client";

import { useEffect, useState } from "react";

export function useUser() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/auth/me")
            .then((r) => r.json())
            .then((data) => {
                if (data.error) {
                    console.error("Auth error:", data.error);
                    setUser(null);
                } else {
                    setUser(data);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch user:", err);
                setUser(null);
                setLoading(false);
            });
    }, []);

    return { user, loading };
}
