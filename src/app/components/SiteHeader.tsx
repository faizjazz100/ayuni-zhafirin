"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function SiteHeader() {
    const [open, setOpen] = useState(false);

    return (
        <header className="mx-auto max-w-6xl px-5 py-5 sm:px-6 bg-transparent">
            <nav className="relative flex items-center justify-between">
                {/* Left: home button */}
                <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                    <div className="relative h-9 w-9 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                        <Image
                            src="/logo.png"
                            alt="ZF x NA"
                            fill
                            className="object-contain p-1"
                            priority
                        />
                    </div>
                    <span className="text-sm font-medium tracking-wide text-zinc-800">
                        ZF x NA
                    </span>
                </Link>

                {/* Desktop tabs */}
                <div className="hidden items-center gap-4 text-sm text-zinc-600 sm:flex">
                    <Link className="hover:text-zinc-900" href="/our-story">Our Story</Link>
                    <Link className="hover:text-zinc-900" href="/venue">Venue</Link>
                    <Link className="hover:text-zinc-900" href="/schedule">Schedule</Link>
                    <Link className="hover:text-zinc-900" href="/contact">Contact</Link>
                    <Link className="hover:text-zinc-900" href="/rsvp">RSVP</Link>
                </div>

                {/* Mobile dropdown button */}
                <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 shadow-sm hover:bg-zinc-50 sm:hidden"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                >
                    Menu
                    <span className="ml-2 text-xs">{open ? "▲" : "▼"}</span>
                </button>

                {/* Mobile dropdown panel */}
                {open && (
                    <div
                        id="mobile-menu"
                        className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-lg sm:hidden"
                    >
                        <div className="p-2">
                            <MobileItem href="/our-story" label="Our Story" onClick={() => setOpen(false)} />
                            <MobileItem href="/venue" label="Venue" onClick={() => setOpen(false)} />
                            <MobileItem href="/schedule" label="Schedule" onClick={() => setOpen(false)} />
                            <MobileItem href="/contact" label="Contact" onClick={() => setOpen(false)} />
                            <MobileItem href="/rsvp" label="RSVP" onClick={() => setOpen(false)} />
                        </div>
                    </div>
                )}
            </nav>

            {/* Click outside to close (simple version) */}
            {open && (
                <button
                    aria-label="Close menu"
                    className="fixed inset-0 z-40 sm:hidden"
                    onClick={() => setOpen(false)}
                    style={{ background: "transparent" }}
                />
            )}
        </header>
    );
}

function MobileItem({
    href,
    label,
    onClick,
}: {
    href: string;
    label: string;
    onClick: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm text-zinc-700 hover:bg-zinc-50"
        >
            {label}
            <span className="text-zinc-400">→</span>
        </Link>
    );
}
