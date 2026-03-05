"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const TABLE = "rsvps";

type Row = {
    id: string;
    full_name: string | null;
    message: string | null;
    created_at: string;
    show_message: boolean | null;
};

export default function MessageCarouselSection() {
    const [rows, setRows] = useState<Row[]>([]);
    const [idx, setIdx] = useState(0);

    const scrollerRef = useRef<HTMLDivElement | null>(null);

    const items = useMemo(() => {
        return (rows ?? [])
            .filter((r) => (r.message ?? "").trim().length > 0)
            .map((r) => ({
                id: r.id,
                name: r.full_name?.trim() || "Guest",
                message: (r.message ?? "").trim(),
                createdAt: r.created_at,
            }));
    }, [rows]);

    // Fetch fewer rows = less work
    useEffect(() => {
        let alive = true;

        (async () => {
            const { data, error } = await supabase
                .from(TABLE)
                .select("id, full_name, message, created_at, show_message")
                .eq("show_message", true)
                .not("message", "is", null)
                .order("created_at", { ascending: false })
                .limit(12);

            if (!alive) return;

            if (error) {
                console.error("Message fetch error:", error.message);
                setRows([]);
                return;
            }

            setRows((data as Row[]) ?? []);
        })();

        return () => {
            alive = false;
        };
    }, []);

    // ✅ Keep idx synced with scroll position (fix dot not following)
    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;

        // Find the currently-most-visible slide instead of relying on el.clientWidth.
        const computeActive = () => {
            const children = Array.from(el.children) as HTMLElement[];
            if (children.length === 0) return;

            const viewportCenter = el.scrollLeft + el.clientWidth / 2;

            let bestIdx = 0;
            let bestDist = Number.POSITIVE_INFINITY;

            for (let i = 0; i < children.length; i++) {
                const c = children[i];
                const center = c.offsetLeft + c.clientWidth / 2;
                const dist = Math.abs(center - viewportCenter);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestIdx = i;
                }
            }

            setIdx((prev) => (prev === bestIdx ? prev : bestIdx));
        };

        // rAF throttle for smooth swipe updates
        let raf = 0;
        const onScroll = () => {
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(computeActive);
        };

        el.addEventListener("scroll", onScroll, { passive: true });

        // also compute once on mount + on resize (when widths change)
        computeActive();
        const onResize = () => computeActive();
        window.addEventListener("resize", onResize);

        return () => {
            if (raf) cancelAnimationFrame(raf);
            el.removeEventListener("scroll", onScroll as any);
            window.removeEventListener("resize", onResize);
        };
    }, [items.length]);

    // ✅ NO AUTOPLAY: removed setInterval + pointer listeners

    if (items.length === 0) return null;

    return (
        <section className="mt-8">
            <div className="rounded-[28px] border border-white/40 bg-white/65 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-10">
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-600">
                        Messages
                    </p>
                    <h2 className="mt-2 font-serif text-3xl font-semibold text-zinc-900">
                        Wishes
                    </h2>
                    <p className="mt-2 text-sm text-zinc-600">
                        Thank you for the kind words.
                    </p>
                </div>

                <div className="mt-8">
                    <div
                        ref={scrollerRef}
                        className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-[24px] border border-black/10 bg-white/80 shadow-sm"
                        style={{
                            WebkitOverflowScrolling: "touch",
                            scrollbarWidth: "none",
                        }}
                    >
                        {/* hide scrollbar (webkit) */}
                        <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

                        {items.map((it) => (
                            <div
                                key={it.id}
                                className="w-full shrink-0 snap-center p-6 sm:p-8"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-black/10 bg-white">
                                        <span className="text-sm">✉️</span>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-zinc-900">
                                            {it.name}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {new Date(it.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-5 text-[17px] leading-relaxed text-zinc-800">
                                    “{trimTo(it.message, 220)}”
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* dots */}
                    <div className="mt-4 flex items-center justify-center gap-2">
                        {items.map((it, i) => (
                            <button
                                key={it.id}
                                onClick={() => {
                                    const el = scrollerRef.current;
                                    if (!el) return;

                                    // scroll to the actual slide (robust)
                                    const child = el.children[i] as HTMLElement | undefined;
                                    if (!child) return;
                                    el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
                                }}
                                className={[
                                    "h-2 w-2 rounded-full transition",
                                    i === idx
                                        ? "bg-zinc-900/70"
                                        : "bg-zinc-900/20 hover:bg-zinc-900/35",
                                ].join(" ")}
                                aria-label={`Go to message ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function trimTo(text: string, max: number) {
    const t = (text ?? "").trim();
    if (t.length <= max) return t;
    return t.slice(0, max).trim() + "...";
}