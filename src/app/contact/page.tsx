"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactPage() {
    // ✅ EDIT THESE
    const COUPLE = "Ayuni & Zhafirin";

    const CONTACTS = [
        { name: "Darwish (Bride’s)", phoneDisplay: "012-846 2690", phoneE164: "60128462690" },
        { name: "Tasha (Bride’s)", phoneDisplay: "011-635 54265", phoneE164: "601163554265" },
        { name: "Mai (Groom’s)", phoneDisplay: "013-355 2455", phoneE164: "60133552455" },
        { name: "Elin (Groom’s)", phoneDisplay: "019-226 6996", phoneE164: "60192266996" },
    ];

    return (
        <main className="min-h-screen text-zinc-800">
            {/* soft glow background */}
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -left-32 -top-28 h-96 w-96 rounded-full bg-black/5 blur-3xl" />
                <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-black/5 blur-3xl" />
            </div>

            {/* Content */}
            <section className="mx-auto max-w-3xl px-5 pb-14 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-10"
                >
                    <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                        Contact
                    </p>
                    <h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">
                        Get in Touch
                    </h1>
                    <p className="mt-3 text-sm text-zinc-600">
                        If you have any questions about the event, location, or RSVP, feel free to contact us.
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        {CONTACTS.map((c) => (
                            <div
                                key={c.name}
                                className="rounded-3xl border border-zinc-200 bg-[#fbf7f3] p-6"
                            >
                                <p className="text-sm text-zinc-600">{c.name}</p>
                                <p className="mt-1 text-lg font-semibold text-zinc-900">
                                    {c.phoneDisplay}
                                </p>

                                <div className="mt-4 flex gap-3">
                                    {/* Call */}
                                    <a
                                        href={`tel:+${c.phoneE164}`}
                                        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-black px-4 py-2 text-sm text-white hover:opacity-90"
                                    >
                                        Call
                                    </a>

                                    {/* WhatsApp */}
                                    <a
                                        href={`https://wa.me/${c.phoneE164}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex flex-1 items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm hover:bg-zinc-50"
                                    >
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 rounded-3xl border border-zinc-200 bg-[#fbf7f3] p-6 text-sm text-zinc-700">
                        <p className="font-medium">Notes</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-700">
                            <li>If you have any questions, please dont hesitate to contact us.</li>
                        </ul>
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

                    <p className="mt-8 text-center text-sm text-zinc-500">
                        © {new Date().getFullYear()} {COUPLE}
                    </p>
                </motion.div>
            </section>

            <style jsx global>{`
        .font-serif {
          font-family: var(--font-serif), ui-serif, Georgia, serif;
        }
      `}</style>
        </main>
    );
}
