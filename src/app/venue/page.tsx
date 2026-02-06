"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LocationPage() {
    // ✅ EDIT THESE
    const COUPLE = "Zhafirin & Ayuni";

    const VENUE_NAME = "Luminare Hall";
    const ADDRESS_LINE_1 = "B-G-02, PJ TRADE CENTRE, 8, Jalan PJU 8/8A, Damansara Perdana,";
    const ADDRESS_LINE_2 = "47820 Petaling Jaya, Selangor";
    const MAP_EMBED_URL =
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.7239655671806!2d101.6132164!3d3.1672346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4f006b35a82b%3A0x1cc4913cab2e37eb!2sLuminare%20Hall!5e0!3m2!1sen!2smy!4v1770207152702!5m2!1sen!2smy";

    // ✅ Put your real links here
    const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/dsUEjfK1u7NhSY386"; // replace
    const WAZE_URL = "https://waze.com/ul/hw2860281s"; // replace

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
                        Location
                    </p>
                    <h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">
                        Venue & Directions
                    </h1>
                    <p className="mt-3 text-sm text-zinc-600">
                        Use Google Maps or Waze for the easiest navigation.
                    </p>

                    {/* Venue Card */}
                    <div className="mt-8 rounded-3xl border border-zinc-200 bg-[#fbf7f3] p-6">
                        <p className="text-sm text-zinc-600">Venue</p>
                        <p className="mt-1 text-lg font-semibold text-zinc-900">
                            {VENUE_NAME}
                        </p>
                        <p className="mt-2 text-sm text-zinc-700">
                            {ADDRESS_LINE_1}
                            <br />
                            {ADDRESS_LINE_2}
                        </p>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <a
                                href={GOOGLE_MAPS_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm text-white hover:opacity-90"
                            >
                                Open in Google Maps
                            </a>

                            <a
                                href={WAZE_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex flex-1 items-center justify-center rounded-2xl border border-zinc-300 bg-white px-5 py-3 text-sm hover:bg-zinc-50"
                            >
                                Open in Waze
                            </a>
                        </div>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
                        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                            <iframe
                                src={MAP_EMBED_URL}
                                className="absolute inset-0 h-full w-full"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                allowFullScreen
                            />
                        </div>
                    </div>


                    {/* Helpful Notes */}
                    <div className="mt-6 rounded-3xl border border-zinc-200 bg-[#fbf7f3] p-6 text-sm text-zinc-700">
                        <p className="font-medium">Notes</p>
                        <ul className="mt-3 list-disc space-y-2 pl-5">
                            <li>Please arrive early for parking.</li>
                            <li>Follow signage at the venue entrance.</li>
                            <li>If you get lost, contact us from the Contact page.</li>
                        </ul>
                    </div>

                    {/* Buttons */}
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
