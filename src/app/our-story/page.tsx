"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PageShell from "@/src/app/components/PageShell";

export default function OurStoryPage() {
    return (
        <main className="min-h-screen text-zinc-800">
            {/* soft background glow */}
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -left-32 -top-28 h-96 w-96 rounded-full bg-black/5 blur-3xl" />
                <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-black/5 blur-3xl" />
            </div>

            {/* Content */}
            <PageShell>
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                    Our Story
                </p>

                <h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">
                    Ayuni & Zhafirin
                </h1>

                <p className="mt-4 text-sm text-zinc-600">
                    A journey that began quietly, and grew into something beautiful.
                </p>

                <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-zinc-700">
                    <p>
                        They met two years ago on the same working pathway, where their daily
                        routines crossed without much thought. Both were focused on their
                        careers, exchanging nothing more than brief greetings and occasional
                        smiles, friendly acquaintances in a busy world.
                    </p>

                    <p>
                        Over time, casual hellos turned into conversations, then shared
                        lunches, and eventually a steady friendship. They supported one
                        another through work challenges and personal struggles, becoming a
                        constant presence in each other’s lives. Yet, quietly and unspoken,
                        one of them wished for something more. A love that felt close, but
                        still just out of reach.
                    </p>

                    <p>
                        One evening, after a particularly difficult day, a heartfelt prayer
                        was whispered. The wish was simple but sincere: to find someone who
                        could be more than a friend, someone truly meant to stay. Unknowingly,
                        the answer to that prayer had already been standing right beside them
                        all along.
                    </p>

                    <p>
                        As the seasons changed, so did their feelings. What began as
                        friendship slowly blossomed into love. Built on trust,
                        understanding, and the comfort of truly knowing one another. The
                        person who was once just a companion on the same working path became
                        the most important part of their life, a blessing quietly granted by
                        an answered prayer.
                    </p>

                    <p>
                        In the end, their love story was not shaped by grand gestures or
                        sudden sparks, but by the gentle and steady growth of two hearts
                        finding their way to each other, proving that sometimes, the most
                        beautiful love stories begin as friendships and bloom when least
                        expected.
                    </p>
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
                    © {new Date().getFullYear()} Ayuni & Zhafirin
                </p>
            </PageShell>

            <style jsx global>{`
        .font-serif {
          font-family: var(--font-serif), ui-serif, Georgia, serif;
        }
      `}</style>
        </main>
    );
}
