"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Session = "Public" | "Private";
type GuestOf = "Bride" | "Groom";
type Filter = "All" | Session;
type GuestFilter = "All" | GuestOf;
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
    created_at: string;
};

export default function AdminPage() {
    const [rows, setRows] = useState<RsvpRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<Filter>("All");
    const [guestFilter, setGuestFilter] = useState<GuestFilter>("All");
    const [sort, setSort] = useState<Sort>("newest");
    const [error, setError] = useState<string>("");
    const [savingId, setSavingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function load() {
        setLoading(true);
        setError("");

        let q = supabase
            .from("rsvps")
            .select("id, full_name, phone, guests, adults, kids, session, guest_of, created_at");

        if (filter !== "All") q = q.eq("session", filter);
        if (guestFilter !== "All") q = q.eq("guest_of", guestFilter);
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
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, guestFilter, sort]);

    const totals = useMemo(() => {
        const submissions = rows.length;
        const totalGuests = rows.reduce((sum, r) => sum + (Number(r.guests) || 0), 0);
        const totalAdults = rows.reduce((sum, r) => sum + (Number(r.adults) || 0), 0);
        const totalKids = rows.reduce((sum, r) => sum + (Number(r.kids) || 0), 0);
        const brideGuests = rows.reduce((sum, r) => sum + (r.guest_of === "Bride" ? (Number(r.guests) || 0) : 0), 0);
        const groomGuests = rows.reduce((sum, r) => sum + (r.guest_of === "Groom" ? (Number(r.guests) || 0) : 0), 0);
        return { submissions, totalGuests, totalAdults, totalKids, brideGuests, groomGuests };
    }, [rows]);

    async function updateGuestOf(id: string, next: GuestOf) {
        setError("");
        setSavingId(id);
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, guest_of: next } : r)));
        const { error } = await supabase.from("rsvps").update({ guest_of: next }).eq("id", id);
        setSavingId(null);
        if (error) {
            setError(error.message);
            await load();
        }
    }

    async function deleteRow(id: string) {
        setError("");
        const ok = window.confirm("Delete this RSVP permanently?\n\nThis cannot be undone.");
        if (!ok) return;
        setDeletingId(id);
        const { error } = await supabase.from("rsvps").delete().eq("id", id);
        setDeletingId(null);
        if (error) {
            setError(error.message);
            return;
        }
        setRows((prev) => prev.filter((r) => r.id !== id));
    }

    function exportCSV() {
        const headers = ["Full Name", "Phone", "Guest Of", "Guests", "Adults", "Kids", "Session", "Submitted At"];
        const lines = rows.map((r) => [
            r.full_name ?? "",
            r.phone ?? "",
            r.guest_of ?? "",
            String(r.guests ?? 0),
            String(r.adults ?? 0),
            String(r.kids ?? 0),
            r.session ?? "",
            new Date(r.created_at).toLocaleString(),
        ]);
        const csv = [headers, ...lines].map((row) => row.map(csvEscape).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `rsvps_${filter.toLowerCase()}_${guestFilter.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    return (
        <main className="min-h-screen px-5 pb-16 text-zinc-800">
            <div className="mx-auto max-w-6xl pt-8 space-y-5">

                {/* ── Header ── */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-zinc-400">Admin</p>
                        <h1 className="mt-1 font-serif text-3xl font-semibold text-zinc-900 sm:text-4xl">
                            RSVP Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-zinc-500">
                            {loading ? "Loading…" : `${totals.submissions} submissions · ${totals.totalGuests} guests total`}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-1.5 rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                            Old View
                        </Link>
                        <Link
                            href="/admin/compact"
                            className="inline-flex items-center gap-1.5 rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                            Compact View
                        </Link>
                        <Link
                            href="/admin/messages"
                            className="inline-flex items-center gap-1.5 rounded-2xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 16V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h11l4 4-1-4h1a2 2 0 002-2z" /></svg>
                            Messages
                        </Link>
                        <button
                            onClick={exportCSV}
                            disabled={rows.length === 0}
                            className="inline-flex items-center gap-1.5 rounded-2xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 transition"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Export CSV
                        </button>
                        <button
                            onClick={load}
                            className="inline-flex items-center gap-1.5 rounded-2xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    <StatCard label="Submissions" value={totals.submissions} highlight />
                    <StatCard label="Total guests" value={totals.totalGuests} highlight />
                    <StatCard label="Adults" value={totals.totalAdults} />
                    <StatCard label="Kids" value={totals.totalKids} />
                    <StatCard label="Bride guests" value={totals.brideGuests} />
                    <StatCard label="Groom guests" value={totals.groomGuests} />
                </div>

                {/* ── Filters ── */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mr-1">Filter</span>
                    {(["All", "Public", "Private"] as Filter[]).map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`rounded-2xl border px-3.5 py-1.5 text-xs font-medium transition ${filter === s
                                ? "border-black bg-black text-white"
                                : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
                                }`}
                        >
                            {s === "All" ? "All Sessions" : s}
                        </button>
                    ))}
                    <div className="h-4 w-px bg-zinc-200 mx-1" />
                    {(["All", "Bride", "Groom"] as GuestFilter[]).map((g) => (
                        <button
                            key={g}
                            onClick={() => setGuestFilter(g)}
                            className={`rounded-2xl border px-3.5 py-1.5 text-xs font-medium transition ${guestFilter === g
                                ? "border-black bg-black text-white"
                                : "border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50"
                                }`}
                        >
                            {g === "All" ? "Bride + Groom" : g}
                        </button>
                    ))}
                    <div className="ml-auto">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as Sort)}
                            className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-xs text-zinc-700 hover:bg-zinc-50"
                        >
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                            <option value="name_az">Name (A–Z)</option>
                        </select>
                    </div>
                </div>

                {/* ── Error ── */}
                {error && (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
                        {error}
                    </div>
                )}

                {/* ── Table ── */}
                <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-zinc-100 bg-zinc-50/80">
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Name</th>
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Phone</th>
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Guest of</th>
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Guests</th>
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Adults</th>
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Kids</th>
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Session</th>
                                    <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Submitted</th>
                                    <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {loading ? (
                                    <>
                                        {[...Array(5)].map((_, i) => (
                                            <tr key={i}>
                                                <td colSpan={9} className="px-5 py-3.5">
                                                    <div className="h-4 w-full animate-pulse rounded-lg bg-zinc-100" />
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                ) : rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-5 py-12 text-center text-sm text-zinc-400">
                                            No submissions found. Try adjusting your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((r) => {
                                        const isSaving = savingId === r.id;
                                        const isDeleting = deletingId === r.id;

                                        return (
                                            <tr
                                                key={r.id}
                                                className={`transition-colors hover:bg-zinc-50/60 ${isDeleting ? "opacity-40" : ""}`}
                                            >
                                                <td className="px-5 py-3.5 font-medium text-zinc-900">
                                                    {r.full_name || "—"}
                                                </td>
                                                <td className="px-5 py-3.5 text-zinc-500 font-mono text-xs">
                                                    {r.phone || "—"}
                                                </td>

                                                {/* Editable guest_of */}
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={(r.guest_of ?? "Bride") as GuestOf}
                                                            onChange={(e) => updateGuestOf(r.id, e.target.value as GuestOf)}
                                                            disabled={isSaving || isDeleting}
                                                            className="rounded-2xl border border-zinc-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-zinc-400 disabled:opacity-50 transition"
                                                        >
                                                            <option value="Bride">Bride</option>
                                                            <option value="Groom">Groom</option>
                                                        </select>
                                                        {isSaving && (
                                                            <span className="text-[11px] text-zinc-400">Saving…</span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <span className="font-semibold text-zinc-800">{r.guests ?? 0}</span>
                                                </td>
                                                <td className="px-5 py-3.5 text-zinc-500">{r.adults ?? 0}</td>
                                                <td className="px-5 py-3.5 text-zinc-500">{r.kids ?? 0}</td>

                                                <td className="px-5 py-3.5">
                                                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${r.session === "Public"
                                                        ? "border-amber-200 bg-amber-50 text-amber-800"
                                                        : r.session === "Private"
                                                            ? "border-violet-200 bg-violet-50 text-violet-800"
                                                            : "border-zinc-200 bg-zinc-50 text-zinc-600"
                                                        }`}>
                                                        {r.session ?? "—"}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-3.5 text-xs text-zinc-400">
                                                    {new Date(r.created_at).toLocaleString("en-MY", {
                                                        day: "numeric", month: "short", year: "numeric",
                                                        hour: "2-digit", minute: "2-digit",
                                                    })}
                                                </td>

                                                <td className="px-5 py-3.5">
                                                    <div className="flex justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteRow(r.id)}
                                                            disabled={isSaving || isDeleting}
                                                            className="rounded-2xl border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 transition"
                                                        >
                                                            {isDeleting ? "Deleting…" : "Delete"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table footer */}
                    {!loading && rows.length > 0 && (
                        <div className="border-t border-zinc-100 bg-zinc-50/50 px-5 py-3">
                            <p className="text-xs text-zinc-400">
                                Showing <span className="font-medium text-zinc-600">{rows.length}</span> submission{rows.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

/* ── Sub-components ── */

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
    return (
        <div className={`rounded-3xl border p-5 ${highlight
            ? "border-black bg-black text-white"
            : "border-zinc-200 bg-white text-zinc-900"
            }`}>
            <p className={`text-[10px] font-semibold uppercase tracking-widest ${highlight ? "text-white/60" : "text-zinc-400"}`}>
                {label}
            </p>
            <p className={`mt-1.5 text-3xl font-semibold ${highlight ? "text-white" : "text-zinc-900"}`}>
                {value}
            </p>
        </div>
    );
}

function csvEscape(v: string) {
    const s = String(v ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
}
