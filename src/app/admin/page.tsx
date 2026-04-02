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
    guests: number | null; // total
    adults: number | null;
    kids: number | null;
    session: Session | null;
    guest_of: GuestOf | null;
    created_at: string; // ISO
};

export default function AdminPage() {
    const [rows, setRows] = useState<RsvpRow[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ Filters
    const [filter, setFilter] = useState<Filter>("All"); // session filter (existing)
    const [guestFilter, setGuestFilter] = useState<GuestFilter>("All"); // NEW guest_of filter

    // ✅ Sort (keep like before)
    const [sort, setSort] = useState<Sort>("newest");

    const [error, setError] = useState<string>("");

    // ✅ Inline edit + delete states
    const [savingId, setSavingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function load() {
        setLoading(true);
        setError("");

        let q = supabase
            .from("rsvps")
            .select(
                "id, full_name, phone, guests, adults, kids, session, guest_of, created_at"
            );

        // filter: session
        if (filter !== "All") q = q.eq("session", filter);

        // filter: guest_of
        if (guestFilter !== "All") q = q.eq("guest_of", guestFilter);

        // sort
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

        // ✅ Totals by guest_of (based on currently loaded rows / current filters)
        const brideGuests = rows.reduce(
            (sum, r) => sum + (r.guest_of === "Bride" ? (Number(r.guests) || 0) : 0),
            0
        );
        const groomGuests = rows.reduce(
            (sum, r) => sum + (r.guest_of === "Groom" ? (Number(r.guests) || 0) : 0),
            0
        );

        return { submissions, totalGuests, totalAdults, totalKids, brideGuests, groomGuests };
    }, [rows]);

    async function updateGuestOf(id: string, next: GuestOf) {
        setError("");
        setSavingId(id);

        // optimistic UI
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, guest_of: next } : r)));

        const { error } = await supabase.from("rsvps").update({ guest_of: next }).eq("id", id);

        setSavingId(null);

        if (error) {
            setError(error.message);
            await load(); // revert by reloading
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

        // remove locally
        setRows((prev) => prev.filter((r) => r.id !== id));
    }

    function exportCSV() {
        const headers = [
            "Full Name",
            "Phone",
            "Guest Of",
            "Guests",
            "Adults",
            "Kids",
            "Session",
            "Submitted At",
        ];

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
        a.download = `rsvps_${filter.toLowerCase()}_${guestFilter.toLowerCase()}_${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    return (
        <main className="min-h-screen px-5 pb-14 text-zinc-800">
            <div className="mx-auto max-w-6xl pt-8">
                <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Admin</p>
                            <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">
                                RSVP Dashboard
                            </h1>
                            <p className="mt-2 text-sm text-zinc-600">
                                Filter by session & guest of, edit guest of, delete entries, export.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link
                                href="/admin/v2"
                                className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm hover:bg-zinc-50"
                            >
                                Version 2
                            </Link>
                            <Link
                                href="/admin/compact"
                                className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm hover:bg-zinc-50"
                            >
                                Compact Version
                            </Link>
                            <Link
                                href="/admin/messages"
                                className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm hover:bg-zinc-50"
                            >
                                Manage Messages
                            </Link>

                            {/* Filter: Session */}
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as Filter)}
                                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                            >
                                <option value="All">All Sessions</option>
                                <option value="Public">Public Only</option>
                                <option value="Private">Private Only</option>
                            </select>

                            {/* ✅ NEW Filter: Guest Of */}
                            <select
                                value={guestFilter}
                                onChange={(e) => setGuestFilter(e.target.value as GuestFilter)}
                                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                            >
                                <option value="All">All Guests</option>
                                <option value="Bride">Bride side</option>
                                <option value="Groom">Groom side</option>
                            </select>

                            {/* Sort */}
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as Sort)}
                                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                            >
                                <option value="newest">Newest first</option>
                                <option value="oldest">Oldest first</option>
                                <option value="name_az">Name (A–Z)</option>
                            </select>

                            {/* Export */}
                            <button
                                onClick={exportCSV}
                                className="rounded-2xl bg-black px-4 py-3 text-sm text-white hover:opacity-90 disabled:opacity-50"
                                disabled={rows.length === 0}
                            >
                                Export Excel (CSV)
                            </button>

                            {/* Manual refresh */}
                            <button
                                onClick={load}
                                className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm hover:bg-zinc-50"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Totals (same style as before + 2 new cards) */}
                    <div className="mt-6 grid gap-4 sm:grid-cols-6">
                        <StatCard label="Total submissions" value={totals.submissions} />
                        <StatCard label="Total guests" value={totals.totalGuests} />
                        <StatCard label="Total adults" value={totals.totalAdults} />
                        <StatCard label="Total kids" value={totals.totalKids} />
                        <StatCard label="Bride guests" value={totals.brideGuests} />
                        <StatCard label="Groom guests" value={totals.groomGuests} />
                    </div>

                    {/* Errors */}
                    {error && (
                        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Table */}
                    <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-200">
                        <div className="overflow-x-auto bg-white">
                            <table className="w-full min-w-[1180px] text-left text-sm">
                                <thead className="bg-zinc-50 text-zinc-600">
                                    <tr>
                                        <th className="px-5 py-4">Name</th>
                                        <th className="px-5 py-4">Phone</th>
                                        <th className="px-5 py-4">Guest of</th>
                                        <th className="px-5 py-4">Guests</th>
                                        <th className="px-5 py-4">Adults</th>
                                        <th className="px-5 py-4">Kids</th>
                                        <th className="px-5 py-4">Session</th>
                                        <th className="px-5 py-4">Submitted</th>
                                        <th className="px-5 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td className="px-5 py-6 text-zinc-600" colSpan={9}>
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : rows.length === 0 ? (
                                        <tr>
                                            <td className="px-5 py-6 text-zinc-600" colSpan={9}>
                                                No submissions found.
                                            </td>
                                        </tr>
                                    ) : (
                                        rows.map((r) => {
                                            const isSaving = savingId === r.id;
                                            const isDeleting = deletingId === r.id;

                                            return (
                                                <tr key={r.id} className="border-t border-zinc-100">
                                                    <td className="px-5 py-4 font-medium text-zinc-900">
                                                        {r.full_name || "-"}
                                                    </td>
                                                    <td className="px-5 py-4 text-zinc-700">{r.phone || "-"}</td>

                                                    {/* ✅ Editable guest_of */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <select
                                                                value={(r.guest_of ?? "Bride") as GuestOf}
                                                                onChange={(e) =>
                                                                    updateGuestOf(r.id, e.target.value as GuestOf)
                                                                }
                                                                disabled={isSaving || isDeleting}
                                                                className="w-[150px] rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 disabled:bg-zinc-50 disabled:text-zinc-500"
                                                            >
                                                                <option value="Bride">Bride</option>
                                                                <option value="Groom">Groom</option>
                                                            </select>
                                                            {isSaving && (
                                                                <span className="text-xs text-zinc-500">Saving…</span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4 text-zinc-700">{r.guests ?? 0}</td>
                                                    <td className="px-5 py-4 text-zinc-700">{r.adults ?? 0}</td>
                                                    <td className="px-5 py-4 text-zinc-700">{r.kids ?? 0}</td>

                                                    <td className="px-5 py-4">
                                                        <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">
                                                            {r.session ?? "-"}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4 text-zinc-600">
                                                        {new Date(r.created_at).toLocaleString()}
                                                    </td>

                                                    {/* ✅ Delete */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex justify-end">
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteRow(r.id)}
                                                                disabled={isSaving || isDeleting}
                                                                className={[
                                                                    "rounded-2xl border px-3 py-2 text-sm transition",
                                                                    "border-red-200 bg-white text-red-700 hover:bg-red-50",
                                                                    "disabled:cursor-not-allowed disabled:opacity-50",
                                                                ].join(" ")}
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
                    </div>

                    <style jsx global>{`
            .font-serif {
              font-family: var(--font-serif), ui-serif, Georgia, serif;
            }
          `}</style>
                </div>
            </div>
        </main>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-3xl border border-zinc-200 bg-[#fbf7f3] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-900">{value}</p>
        </div>
    );
}

function csvEscape(v: string) {
    const s = String(v ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
}