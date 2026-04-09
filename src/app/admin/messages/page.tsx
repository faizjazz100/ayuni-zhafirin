"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type MsgFilter = "all" | "featured" | "hidden";

type MsgRow = {
    id: string;
    full_name: string | null;
    message: string | null;
    show_message: boolean | null;
    created_at: string;
};

export default function AdminMessagesPage() {
    const [state, setState] = useState<{
        rows: MsgRow[];
        loading: boolean;
        error: string;
    }>({ rows: [], loading: true, error: "" });

    const { rows, loading, error } = state;
    const [filter, setFilter] = useState<MsgFilter>("all");
    const [savingId, setSavingId] = useState<string>("");

    async function load(isMounted?: () => boolean) {
        setState((s) => ({ ...s, loading: true, error: "" }));

        const { data, error } = await supabase
            .from("rsvps")
            .select("id, full_name, message, show_message, created_at")
            .not("message", "is", null)
            .order("created_at", { ascending: false })
            .limit(200);

        if (isMounted && !isMounted()) return;

        if (error) {
            setState((s) => ({ ...s, loading: false, error: error.message, rows: [] }));
            return;
        }

        const cleaned = ((data ?? []) as MsgRow[]).filter(
            (r) => (r.message ?? "").trim().length > 0
        );

        setState((s) => ({ ...s, loading: false, error: "", rows: cleaned }));
    }

    async function setFeatured(id: string, value: boolean) {
        setSavingId(id);
        setState((s) => ({ ...s, error: "" }));

        const { error } = await supabase
            .from("rsvps")
            .update({ show_message: value })
            .eq("id", id);

        if (error) {
            setState((s) => ({ ...s, error: error.message }));
        } else {
            setState((s) => ({
                ...s,
                rows: s.rows.map((r) => (r.id === id ? { ...r, show_message: value } : r)),
            }));
        }

        setSavingId("");
    }

    useEffect(() => {
        let mounted = true;
        load(() => mounted);
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const visible = useMemo(() => {
        if (filter === "all") return rows;
        if (filter === "featured") return rows.filter((r) => r.show_message === true);
        return rows.filter((r) => r.show_message !== true);
    }, [rows, filter]);

    const counts = useMemo(() => {
        const total = rows.length;
        const featured = rows.filter((r) => r.show_message === true).length;
        return { total, featured, hidden: total - featured };
    }, [rows]);

    return (
        <main className="min-h-screen px-5 pb-14 text-zinc-800">
            <div className="mx-auto max-w-6xl pb-16 pt-10 sm:px-6 sm:pt-14">
                <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-10 space-y-5">

                    {/* ── Header ── */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.28em] text-zinc-400">Admin</p>
                            <h1 className="mt-1 font-serif text-3xl font-semibold text-zinc-900 sm:text-4xl">
                                Message Manager
                            </h1>
                            <p className="mt-1 text-sm text-zinc-500">
                                {loading
                                    ? "Loading…"
                                    : `${counts.total} messages · ${counts.featured} featured`}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href="/admin"
                                className="inline-flex items-center gap-1.5 rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                RSVP Dashboard
                            </Link>
                            <button
                                onClick={() => load()}
                                className="inline-flex items-center gap-1.5 rounded-2xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* ── Stat Pills ── */}
                    <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-2">
                        <MiniStat label="Total" value={counts.total} highlight />
                        <MiniStat label="Featured" value={counts.featured} dot="bg-amber-400" />
                        <MiniStat label="Hidden" value={counts.hidden} />
                    </div>

                    {/* ── Filter Pills ── */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mr-1">
                            Filter
                        </span>
                        {(["all", "featured", "hidden"] as MsgFilter[]).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`rounded-2xl border px-3.5 py-1.5 text-xs font-medium transition ${
                                    filter === f
                                        ? "border-black bg-black text-white"
                                        : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
                                }`}
                            >
                                {f === "all" ? "All" : f === "featured" ? "Featured" : "Hidden"}
                            </button>
                        ))}
                    </div>

                    {/* ── Error ── */}
                    {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* ── Cards ── */}
                    {loading ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="rounded-2xl border border-zinc-100 p-4 space-y-3">
                                    <div className="flex justify-between">
                                        <div className="h-4 w-32 animate-pulse rounded-lg bg-zinc-100" />
                                        <div className="h-4 w-16 animate-pulse rounded-lg bg-zinc-100" />
                                    </div>
                                    <div className="h-3 w-full animate-pulse rounded-lg bg-zinc-100" />
                                    <div className="h-3 w-4/5 animate-pulse rounded-lg bg-zinc-100" />
                                    <div className="h-3 w-3/5 animate-pulse rounded-lg bg-zinc-100" />
                                </div>
                            ))}
                        </div>
                    ) : visible.length === 0 ? (
                        <p className="py-12 text-center text-sm text-zinc-400">No messages found.</p>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {visible.map((r) => (
                                <MessageCard
                                    key={r.id}
                                    row={r}
                                    saving={savingId === r.id}
                                    onToggle={(v) => setFeatured(r.id, v)}
                                />
                            ))}
                        </div>
                    )}

                    {/* ── Footer count ── */}
                    {!loading && visible.length > 0 && (
                        <p className="text-xs text-zinc-400">
                            Showing{" "}
                            <span className="font-medium text-zinc-600">{visible.length}</span>{" "}
                            message{visible.length !== 1 ? "s" : ""}
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}

function MessageCard({
    row,
    saving,
    onToggle,
}: {
    row: MsgRow;
    saving: boolean;
    onToggle: (v: boolean) => void;
}) {
    const isFeatured = row.show_message === true;

    return (
        <div className={`flex flex-col rounded-2xl border p-4 transition-colors ${
            isFeatured ? "border-amber-200 bg-amber-50/60" : "border-zinc-200 bg-white hover:border-zinc-300"
        }`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-medium text-zinc-900">{row.full_name || "—"}</p>
                <p className="text-[11px] text-zinc-400">
                    {new Date(row.created_at).toLocaleDateString("en-MY", {
                        day: "numeric", month: "short", year: "numeric",
                    })}
                </p>
            </div>

            <p className="mt-2 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-zinc-600">
                {row.message}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
                <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${isFeatured ? "bg-amber-400" : "bg-zinc-300"}`} />
                    <span className={`text-xs font-medium ${isFeatured ? "text-amber-700" : "text-zinc-400"}`}>
                        {isFeatured ? "Featured" : "Not featured"}
                    </span>
                </div>
                <button
                    disabled={saving}
                    onClick={() => onToggle(!isFeatured)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                        isFeatured
                            ? "bg-amber-200 text-amber-900 hover:bg-amber-300"
                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                >
                    {saving ? "Saving…" : isFeatured ? "Unfeature" : "Feature"}
                </button>
            </div>
        </div>
    );
}

function MiniStat({ label, value, highlight, dot }: { label: string; value: number; highlight?: boolean; dot?: string }) {
    return (
        <div className={`flex items-center justify-between gap-2 rounded-2xl border px-4 py-2.5 text-sm sm:justify-start ${highlight ? "border-black bg-black text-white" : "border-zinc-200 bg-white text-zinc-700"}`}>
            <div className="flex items-center gap-1.5">
                {dot && <span className={`h-2 w-2 rounded-full ${dot}`} />}
                <span className={highlight ? "text-white/70" : "text-zinc-400"}>{label}</span>
            </div>
            <span className="text-base font-bold">{value}</span>
        </div>
    );
}
