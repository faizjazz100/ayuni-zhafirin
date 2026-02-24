"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Item = {
    time: string;
    title: string;
    details?: string[];
};

const items: Item[] = [
    { time: "8:00 AM", title: "Family Arrival" },
    {
        time: "8:15 AM",
        title: "Solemnisation Ceremony",
    },
    { time: "10:00 AM", title: "Arrival of Guests", },
    { time: "10:30 AM", title: "Doa Recital & Opening Remarks" },
    { time: "11:00 AM", title: "Photo Session" },
    { time: "12:30 PM", title: "End of Ceremony" },
];

export default function SchedulePage() {
    const COUPLE = "Ayuni & Zhaf";
    return (
        <main className="min-h-screen text-zinc-800">
            {/* soft glow background */}
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -left-32 -top-28 h-96 w-96 rounded-full bg-black/5 blur-3xl" />
                <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-black/5 blur-3xl" />
            </div>

            <section className="mx-auto max-w-4xl px-6 pb-14">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.1 }}
                    className="rounded-[28px] border border-zinc-200 bg-white p-8 shadow-sm sm:p-10"
                >
                    <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                        Event Schedule
                    </p>
                    <h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">
                        Tentative
                    </h1>
                    <p className="mt-3 text-sm text-zinc-600">
                        Timeline for the ceremony. Times are approximate.
                    </p>

                    <div className="mt-8 space-y-4">
                        {items.map((it, idx) => (
                            <motion.div
                                key={`${it.time}-${idx}`}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.45, delay: Math.min(idx * 0.03, 0.2) }}
                                className="rounded-3xl border border-zinc-200 bg-[#fbf7f3] p-6"
                            >
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-semibold">{it.time}</span>
                                    </div>
                                    <div className="sm:text-right">
                                        <div className="text-base font-semibold text-zinc-900">
                                            {it.title}
                                        </div>
                                        {it.details?.length ? (
                                            <ul className="mt-2 space-y-1 text-sm text-zinc-700">
                                                {it.details.map((d) => (
                                                    <li key={d} className="leading-relaxed">
                                                        • {d}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : null}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-5 py-3 text-sm hover:bg-zinc-50"
                        >
                            Back to Home
                        </Link>
                        <Link
                            href="/rsvp"
                            className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm text-white hover:opacity-90"
                        >
                            RSVP
                        </Link>
                    </div>
                    <footer className="mt-10 text-center text-sm text-zinc-600">
                        © {new Date().getFullYear()} {COUPLE}
                    </footer>
                </motion.div>
            </section>

            {/* font helper (works if you set Playfair in layout.tsx variables) */}
            <style jsx global>{`
        .font-serif {
          font-family: var(--font-serif), ui-serif, Georgia, serif;
        }
      `}</style>
        </main>
    );
}
