"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Session = "Public" | "Private";
type GuestOf = "Bride" | "Groom";
type SessionFilter = "All" | Session;
type GuestOfFilter = "All" | GuestOf;
type Sort = "newest" | "oldest" | "name_az";

export const dynamic = "force-dynamic";

type RsvpRow = {
    id: string;
    full_name: string | null;
    phone: string | null;
    guests: number | null;
    adults: number | null;
    kids: number | null;
    session: Session | null;
    guest_of: GuestOf | null;
    message: string | null;
    created_at: string;
};

export default function CompactAdminPage() {
    const [rows, setRows] = useState<RsvpRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [sessionFilter, setSessionFilter] = useState<SessionFilter>("All");
    const [guestOfFilter, setGuestOfFilter] = useState<GuestOfFilter>("All");
    const [sort, setSort] = useState<Sort>("newest");
    const [error, setError] = useState("");
    const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({});
    const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 20;

    async function load() {
        setLoading(true);
        setError("");

        let q = supabase
            .from("rsvps")
            .select(
                "id, full_name, phone, guests, adults, kids, session, guest_of, message, created_at"
            );

        if (sessionFilter !== "All") q = q.eq("session", sessionFilter);
        if (guestOfFilter !== "All") q = q.eq("guest_of", guestOfFilter);
        if (sort === "newest") q = q.order("created_at", { ascending: false });
        if (sort === "oldest") q = q.order("created_at", { ascending: true });
        if (sort === "name_az") q = q.order("full_name", { ascending: true });

        const { data, error } = await q;

        if (error) {
            setError(error.message);
            setRows([]);
        } else {
            setRows((data ?? []) as RsvpRow[]);
        }
        setLoading(false);
    }

    useEffect(() => {
        setPage(1);
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionFilter, guestOfFilter, sort]);

    const totals = useMemo(() => {
        const submissions = rows.length;
        const totalGuests = rows.reduce((sum, r) => sum + (Number(r.guests) || 0), 0);
        const totalAdults = rows.reduce((sum, r) => sum + (Number(r.adults) || 0), 0);
        const totalKids = rows.reduce((sum, r) => sum + (Number(r.kids) || 0), 0);
        const sessionPublic = rows.filter((r) => r.session === "Public").reduce((sum, r) => sum + (Number(r.guests) || 0), 0);
        const sessionPrivate = rows.filter((r) => r.session === "Private").reduce((sum, r) => sum + (Number(r.guests) || 0), 0);
        const bride = rows.filter((r) => r.guest_of === "Bride").reduce((sum, r) => sum + (Number(r.guests) || 0), 0);
        const groom = rows.filter((r) => r.guest_of === "Groom").reduce((sum, r) => sum + (Number(r.guests) || 0), 0);
        return { submissions, totalGuests, totalAdults, totalKids, sessionPublic, sessionPrivate, bride, groom };
    }, [rows]);

    const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const paginatedRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function exportCSV() {
        const headers = ["Full Name", "Phone", "Guests", "Adults", "Kids", "Session", "Guest Of", "Message", "Submitted At"];
        const lines = rows.map((r) => [
            r.full_name ?? "",
            r.phone ?? "",
            String(r.guests ?? 0),
            String(r.adults ?? 0),
            String(r.kids ?? 0),
            r.session ?? "",
            r.guest_of ?? "",
            r.message ?? "",
            new Date(r.created_at).toLocaleString(),
        ]);
        const csv = [headers, ...lines].map((row) => row.map(csvEscape).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `rsvps_compact_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    async function updateGuestOf(id: string, next: GuestOf) {
        setError("");
        setSavingIds((m) => ({ ...m, [id]: true }));
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, guest_of: next } : r)));
        const { error } = await supabase.from("rsvps").update({ guest_of: next }).eq("id", id);
        setSavingIds((m) => { const copy = { ...m }; delete copy[id]; return copy; });
        if (error) {
            setError(error.message);
            await load();
        }
    }

    async function confirmDelete(id: string) {
        const ok = window.confirm("Delete this RSVP permanently?\n\nThis cannot be undone.");
        if (!ok) return;
        setDeletingIds((m) => ({ ...m, [id]: true }));
        setError("");
        const prev = rows;
        setRows((r) => r.filter((x) => x.id !== id));
        const { error } = await supabase.from("rsvps").delete().eq("id", id);
        if (error) {
            setRows(prev);
            setError(`Delete failed: ${error.message}`);
        } else {
            await load();
        }
        setDeletingIds((m) => { const copy = { ...m }; delete copy[id]; return copy; });
    }

    const sessionColor: Record<string, string> = {
        "Public": "bg-amber-50 text-amber-800 border-amber-200",
        "Private": "bg-violet-50 text-violet-800 border-violet-200",
    };

    const sessionDot: Record<string, string> = {
        "Public": "bg-amber-400",
        "Private": "bg-violet-400",
    };

    const guestOfColor: Record<string, string> = {
        Bride: "bg-rose-50 text-rose-700 border-rose-200",
        Groom: "bg-slate-50 text-slate-700 border-slate-200",
    };

    return (
        <main className="min-h-screen px-5 pb-14 text-zinc-800">

            <div className="mx-auto max-w-4xl pb-16 pt-10 sm:px-6 sm:pt-14">
                <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
                    {/* ── Header ── */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.34em]">Admin</p>
                            <h1 className="mt-1 font-serif text-3xl font-semibold text-zinc-900">
                                RSVP List
                            </h1>
                            <p className="mt-1 text-sm text-zinc-500">
                                {loading ? "Loading…" : `${totals.submissions} submissions · ${totals.totalGuests} guests · Page ${page} of ${totalPages}`}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href="/admin"
                                className="inline-flex items-center gap-1.5 rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                Old View
                            </Link>
                            <Link
                                href="/admin/v2"
                                className="inline-flex items-center gap-1.5 rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                Version 2
                            </Link>
                            <button
                                onClick={exportCSV}
                                disabled={rows.length === 0}
                                className="inline-flex items-center gap-1.5 rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-800 hover:bg-zinc-50 disabled:opacity-40 transition"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Export CSV
                            </button>
                            <button
                                onClick={load}
                                className="inline-flex items-center gap-1.5 rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-800 hover:bg-zinc-50 transition"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* ── Mini Stats ── */}
                    <div className="mb-5 flex flex-wrap gap-2">
                        <MiniStat label="Total guests" value={totals.totalGuests} highlight />
                        <MiniStat label="Adults" value={totals.totalAdults} />
                        <MiniStat label="Kids" value={totals.totalKids} />
                        <div className="h-6 w-px bg-black/10 self-center mx-1" />
                        <MiniStat label="Public" value={totals.sessionPublic} dot="bg-amber-400" />
                        <MiniStat label="Private" value={totals.sessionPrivate} dot="bg-violet-400" />
                        <div className="h-6 w-px bg-black/10 self-center mx-1" />
                        <MiniStat label="Bride" value={totals.bride} dot="bg-rose-400" />
                        <MiniStat label="Groom" value={totals.groom} dot="bg-slate-400" />
                    </div>

                    {/* ── Filters ── */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mr-1">Filter</span>
                        {(["All", "Public", "Private"] as SessionFilter[]).map((s) => (
                            <button
                                key={s}
                                onClick={() => setSessionFilter(s)}
                                className={`rounded-2xl border px-3 py-1.5 text-xs font-medium transition ${sessionFilter === s
                                    ? "border-black bg-black text-white"
                                    : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
                                    }`}
                            >
                                {s === "All" ? "All" : s}
                            </button>
                        ))}
                        <div className="h-4 w-px bg-black/10 mx-0.5" />
                        {(["All", "Bride", "Groom"] as GuestOfFilter[]).map((g) => (
                            <button
                                key={g}
                                onClick={() => setGuestOfFilter(g)}
                                className={`rounded-2xl border px-3 py-1.5 text-xs font-medium transition ${guestOfFilter === g
                                    ? "border-black bg-black text-white"
                                    : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
                                    }`}
                            >
                                {g === "All" ? "Both" : g}
                            </button>
                        ))}
                        <div className="ml-auto">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as Sort)}
                                className="rounded-2xl border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="name_az">Name A–Z</option>
                            </select>
                        </div>
                    </div>

                    {/* ── Error ── */}
                    {error && (
                        <div className="mb-4 rounded-2xl border border-zinc-200 bg-white p-3 text-sm text-zinc-700">{error}</div>
                    )}

                    {/* ── List ── */}
                    {loading ? (
                        <div className="flex flex-col gap-2">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-14 animate-pulse rounded-2xl border border-black/5 bg-white/60" />
                            ))}
                        </div>
                    ) : rows.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-[28px] border border-black/5 bg-white/60 py-20 text-center">
                            <p className="text-sm font-medium text-zinc-400">No submissions found</p>
                            <p className="mt-1 text-xs text-zinc-300">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1.5">
                            {paginatedRows.map((r, idx) => {
                                const isExpanded = expandedId === r.id;
                                const initials = (r.full_name ?? "?")
                                    .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
                                const hasMessage = r.message && r.message.trim().length > 0;

                                return (
                                    <div
                                        key={r.id}
                                        className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm transition-all duration-200"
                                    >
                                        {/* ── Compact Row ── */}
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : r.id)}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/60 transition"
                                        >
                                            {/* Session dot */}
                                            <span className={`h-2 w-2 shrink-0 rounded-full ${r.session ? sessionDot[r.session] : "bg-zinc-300"}`} />

                                            {/* Initials */}
                                            <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-[#7A0022]/10 text-[11px] font-bold text-[#7A0022]">
                                                {initials}
                                            </div>

                                            {/* Name + phone */}
                                            <div className="flex-1 min-w-0">
                                                <p className="truncate text-sm font-semibold text-zinc-900 leading-tight">
                                                    {r.full_name || "—"}
                                                </p>
                                                <p className="text-[11px] text-zinc-400">{r.phone || "No phone"}</p>
                                            </div>

                                            {/* Badges */}
                                            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                                                {r.session && (
                                                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${sessionColor[r.session]}`}>
                                                        {r.session}
                                                    </span>
                                                )}
                                                {r.guest_of && (
                                                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${guestOfColor[r.guest_of]}`}>
                                                        {r.guest_of}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Guest counts */}
                                            <div className="flex items-center gap-2 shrink-0 text-right">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-xs text-zinc-400">👥</span>
                                                    <span className="text-sm font-bold text-zinc-800">{r.guests ?? 0}</span>
                                                </div>
                                                <span className="text-zinc-200 text-xs">|</span>
                                                <div className="flex items-center gap-0.5 text-[11px] text-zinc-400">
                                                    <span>{r.adults ?? 0}A</span>
                                                    <span className="text-zinc-300">·</span>
                                                    <span>{r.kids ?? 0}K</span>
                                                </div>
                                            </div>

                                            {/* Message indicator */}
                                            {hasMessage && (
                                                <svg className="h-3.5 w-3.5 shrink-0 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 16V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h11l4 4-1-4h1a2 2 0 002-2z" />
                                                </svg>
                                            )}

                                            {/* Chevron */}
                                            <svg
                                                className={`h-3.5 w-3.5 shrink-0 text-zinc-300 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* ── Expanded Detail ── */}
                                        {isExpanded && (
                                            <div className="border-t border-black/5 bg-zinc-50/60 px-4 py-3 flex flex-col gap-3">

                                                {/* Editable Guest Of */}
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 w-16 shrink-0">Guest of</p>
                                                    <select
                                                        value={(r.guest_of ?? "Bride") as GuestOf}
                                                        onChange={(e) => updateGuestOf(r.id, e.target.value as GuestOf)}
                                                        disabled={!!savingIds[r.id] || !!deletingIds[r.id]}
                                                        className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-zinc-700 disabled:opacity-50 transition"
                                                    >
                                                        <option value="Bride">Bride</option>
                                                        <option value="Groom">Groom</option>
                                                    </select>
                                                    {savingIds[r.id] && <span className="text-[11px] text-zinc-400">Saving…</span>}
                                                </div>

                                                {/* Mobile session badge */}
                                                <div className="flex sm:hidden items-center gap-1.5">
                                                    {r.session && (
                                                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${sessionColor[r.session]}`}>
                                                            {r.session}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Message */}
                                                {hasMessage && (
                                                    <div className="rounded-xl border border-black/5 bg-white/70 px-3 py-2.5">
                                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">Message</p>
                                                        <p className="text-sm italic text-zinc-600">&quot;{r.message?.trim()}&quot;</p>
                                                    </div>
                                                )}

                                                {/* Submitted date + delete */}
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[11px] text-zinc-400">
                                                        Submitted{" "}
                                                        <span className="font-medium text-zinc-500">
                                                            {new Date(r.created_at).toLocaleString("en-MY", {
                                                                day: "numeric", month: "short", year: "numeric",
                                                                hour: "2-digit", minute: "2-digit",
                                                            })}
                                                        </span>
                                                    </p>
                                                    <button
                                                        onClick={() => confirmDelete(r.id)}
                                                        disabled={!!deletingIds[r.id] || !!savingIds[r.id]}
                                                        className="inline-flex items-center gap-1 rounded-2xl border border-zinc-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 transition"
                                                    >
                                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        {deletingIds[r.id] ? "Deleting…" : "Delete"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ── Pagination ── */}
                    {!loading && rows.length > PAGE_SIZE && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            <button
                                onClick={() => { setPage((p) => Math.max(1, p - 1)); setExpandedId(null); }}
                                disabled={page === 1}
                                className="inline-flex items-center gap-1.5 rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-30 transition"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                Prev
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                                    const isActive = p === page;
                                    const isNear = Math.abs(p - page) <= 1 || p === 1 || p === totalPages;
                                    if (!isNear) {
                                        if (p === 2 && page > 3) return <span key={p} className="text-xs text-zinc-400 px-1">…</span>;
                                        if (p === totalPages - 1 && page < totalPages - 2) return <span key={p} className="text-xs text-zinc-400 px-1">…</span>;
                                        return null;
                                    }
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => { setPage(p); setExpandedId(null); }}
                                            className={`h-8 w-8 rounded-2xl text-sm font-medium transition ${isActive
                                                ? "bg-black text-white"
                                                : "border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); setExpandedId(null); }}
                                disabled={page === totalPages}
                                className="inline-flex items-center gap-1.5 rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-30 transition"
                            >
                                Next
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </main>
    );
}

/* ── Sub-components ── */

function MiniStat({ label, value, highlight, dot }: { label: string; value: number; highlight?: boolean; dot?: string }) {
    return (
        <div className={`flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-xs ${highlight ? "border-black bg-black text-white" : "border-zinc-200 bg-white text-zinc-700"}`}>
            {dot && <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />}
            <span className={highlight ? "text-white/70" : "text-zinc-400"}>{label}</span>
            <span className="font-bold">{value}</span>
        </div>
    );
}

function csvEscape(v: string) {
    const s = String(v ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
}
