"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginClient() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const sp = useSearchParams();
    const next = sp.get("next") || "/admin";

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) router.replace(next);
        });
    }, [router, next]);

    async function signIn(e: React.FormEvent) {
        e.preventDefault();
        setErr("");
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        setLoading(false);
        if (error) return setErr(error.message);

        router.replace(next);
    }

    return (
        <main className="min-h-screen px-5 py-10 text-zinc-800">
            <div className="mx-auto max-w-md rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
                <h1 className="font-serif text-3xl font-semibold">Admin Login</h1>
                <p className="mt-2 text-sm text-zinc-600">Sign in to access admin pages.</p>

                {err ? (
                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {err}
                    </div>
                ) : null}

                <form onSubmit={signIn} className="mt-6 space-y-3">
                    <input
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        required
                    />
                    <input
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        required
                    />

                    <button
                        disabled={loading}
                        className="w-full rounded-2xl bg-black px-4 py-3 text-sm text-white hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>

            <style jsx global>{`
        .font-serif {
          font-family: var(--font-serif), ui-serif, Georgia, serif;
        }
      `}</style>
        </main>
    );
}
